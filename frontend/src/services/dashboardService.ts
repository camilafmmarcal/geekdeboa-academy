
import { api } from "./api";
import { cursoService } from "./cursoService";

import type { CategoriaCurso, RespostaAPI } from "../types/curso";

import type {
  Disciplina,
  RespostaAssuntos,
  SimuladoResumo,
  DadosDashboard
} from "../types/dashboard";

type Resultado<T> = PromiseSettledResult<T>;

function valorOuNulo<T>(
  resultado: Resultado<T>
): T | null {
  return resultado.status === "fulfilled"
    ? resultado.value
    : null;
}

export const dashboardService = {
  async carregar(
    signal?: AbortSignal
  ): Promise<DadosDashboard> {

    const [
      respostaCursos,
      respostaDisciplinas,
      respostaSimulados,
      respostaCategorias
    ] = await Promise.allSettled([
      cursoService.listar({}, signal),

      api.get<RespostaAPI<Disciplina>>(
        "/disciplinas",
        { signal }
      ).then((resposta) => resposta.data),

      api.get<RespostaAPI<SimuladoResumo>>(
        "/simulados",
        { signal }
      ).then((resposta) => resposta.data),

      cursoService.listarCategorias(signal)
    ]);

    const cursos = valorOuNulo(respostaCursos);
    const disciplinas = valorOuNulo(respostaDisciplinas);
    const simulados = valorOuNulo(respostaSimulados);
    const categorias = valorOuNulo<RespostaAPI<CategoriaCurso>>(
      respostaCategorias
    );

    const avisos: string[] = [];

    if (!cursos) {
      avisos.push("Cursos indisponíveis.");
    }

    if (!disciplinas) {
      avisos.push("Disciplinas indisponíveis.");
    }

    if (!simulados) {
      avisos.push("Simulados indisponíveis.");
    }

    if (!categorias) {
      avisos.push("Categorias indisponíveis.");
    }

    let totalAssuntos: number | null = null;

    if (disciplinas) {
      const resultados = await Promise.allSettled(
        disciplinas.dados.map(async (disciplina) => {
          const resposta = await api.get<RespostaAssuntos>(
            `/disciplinas/${disciplina.id}/assuntos`,
            { signal }
          );

          return resposta.data.total;
        })
      );

      if (
        resultados.every(
          (resultado) => resultado.status === "fulfilled"
        )
      ) {
        totalAssuntos = resultados.reduce(
          (total, resultado) => {
            return total +
              (resultado.status === "fulfilled"
                ? resultado.value
                : 0);
          },
          0
        );
      } else {
        avisos.push("Não foi possível calcular todos os assuntos.");
      }
    } else {
      avisos.push("Assuntos indisponíveis.");
    }

    return {
      indicadores: {
        cursos: cursos?.total ?? null,
        disciplinas: disciplinas?.total ?? null,
        assuntos: totalAssuntos,
        simulados: simulados?.total ?? null
      },

      categoriasDisponiveis: categorias
        ? categorias.dados.map((item) => item.categoria)
        : null,

      avisos
    };
  }
};
