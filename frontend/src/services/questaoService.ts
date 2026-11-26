
import { api } from "./api";

export interface Disciplina {
  id: number;
  nome: string;
}

export interface Assunto {
  id: number;
  disciplina_id: number;
  nome: string;
}

export interface QuestaoResumo {
  id: number;
  enunciado: string;
  dificuldade: "FACIL" | "MEDIA" | "DIFICIL";
  assunto: string;
  disciplina: string;
  banca: string | null;
}

export interface QuestaoDetalhe extends QuestaoResumo {
  alternativas: {
    id: number;
    letra: string;
    texto: string;
  }[];
}

export interface FiltrosQuestoes {
  disciplina_id?: number;
  assunto_id?: number;
  dificuldade?: "FACIL" | "MEDIA" | "DIFICIL";
  pagina: number;
}

export const questaoService = {
  async disciplinas(signal?: AbortSignal) {
    const resposta = await api.get<{
      total: number;
      dados: Disciplina[];
    }>("/disciplinas", { signal });

    return resposta.data;
  },

  async assuntos(
    disciplinaId: number,
    signal?: AbortSignal
  ) {
    const resposta = await api.get<{
      total: number;
      dados: Assunto[];
    }>(
      `/disciplinas/${disciplinaId}/assuntos`,
      { signal }
    );

    return resposta.data;
  },

  async listar(
    filtros: FiltrosQuestoes,
    signal?: AbortSignal
  ) {
    const resposta = await api.get<{
      pagina: number;
      quantidade: number;
      dados: QuestaoResumo[];
    }>("/questoes", {
      params: filtros,
      signal
    });

    return resposta.data;
  },

  async buscarPorId(
    id: number,
    signal?: AbortSignal
  ) {
    const resposta = await api.get<QuestaoDetalhe>(
      `/questoes/${id}`,
      { signal }
    );

    return resposta.data;
  }
};
