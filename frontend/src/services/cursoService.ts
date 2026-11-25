
import { api } from "./api";

import type {
  Curso,
  CursoModulo,
  CategoriaCurso,
  FiltrosCurso,
  RespostaAPI
} from "../types/curso";

export const cursoService = {
  async listar(
    filtros: FiltrosCurso = {},
    signal?: AbortSignal
  ): Promise<RespostaAPI<Curso>> {

    const resposta = await api.get<RespostaAPI<Curso>>(
      "/cursos",
      {
        params: filtros,
        signal
      }
    );

    return resposta.data;
  },

  async listarCategorias(
    signal?: AbortSignal
  ): Promise<RespostaAPI<CategoriaCurso>> {

    const resposta = await api.get<
      RespostaAPI<CategoriaCurso>
    >("/cursos/categorias", { signal });

    return resposta.data;
  },
  

async listarModulos(
  cursoId: number,
  signal?: AbortSignal
): Promise<RespostaAPI<CursoModulo>> {
  const resposta = await api.get<RespostaAPI<CursoModulo>>(
    `/cursos/${cursoId}/modulos`,
    { signal }
  );

  return resposta.data;
},


  async buscarPorId(id: number): Promise<Curso> {
    const resposta = await api.get<Curso>(
      `/cursos/${id}`
    );

    return resposta.data;
  }
};
