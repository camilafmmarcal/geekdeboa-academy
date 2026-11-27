import { api } from "./api";

export interface SimuladoResumo {
  id: number;
  titulo: string;
  descricao: string | null;
  duracao_minutos: number;
  quantidade_questoes: number;
}
export interface QuestaoSimulado {
  id: number;
  ordem: number;
  enunciado: string;
  dificuldade: string;
  alternativas: Array<{ id: number; letra: string; texto: string }>;
}
export interface SimuladoDetalhe extends SimuladoResumo {
  questoes: QuestaoSimulado[];
}
export interface ResultadoSimulado {
  simulado_id: number;
  total_questoes: number;
  respondidas: number;
  acertos: number;
  percentual: number;
  questoes: Array<{
    questao_id: number;
    alternativa_id: number | null;
    letra_correta: string;
    correta: boolean;
    comentario: string | null;
  }>;
}
export const simuladoService = {
  async listar() {
    const { data } = await api.get<{ total: number; dados: SimuladoResumo[] }>("/simulados");
    return data.dados;
  },
  async buscarPorId(id: number) {
    const { data } = await api.get<SimuladoDetalhe>(`/simulados/${id}`);
    return data;
  },
  async finalizar(id: number, respostas: Array<{ questao_id: number; alternativa_id: number }>) {
    const { data } = await api.post<ResultadoSimulado>(`/simulados/${id}/finalizar`, { respostas });
    return data;
  }
};
