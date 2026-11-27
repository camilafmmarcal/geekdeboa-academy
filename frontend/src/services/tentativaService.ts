
import { api } from "./api";
import { authService } from "./authService";

export interface RespostaTentativa {
  questao_id: number;
  alternativa_id: number;
}

export interface ResultadoTentativa {
  tentativa_id: number;
  total_questoes: number;
  respondidas: number;
  acertos: number;
  percentual: number;
  questoes: {
    questao_id: number;
    alternativa_id: number | null;
    correta: boolean;
    letra_correta: string;
    comentario: string | null;
  }[];
}

export interface HistoricoTentativa {
  id: number;
  simulado: string;
  status: "EM_ANDAMENTO" | "FINALIZADA" | "EXPIRADA" | "DESISTIDA";
  iniciado_em: string;
  finalizado_em: string | null;
  acertos: number | null;
  total_questoes: number | null;
}

function autorizacao() {
  const token = authService.obterToken();

  if (!token) {
    throw new Error(
      "Entre na sua conta para salvar os resultados."
    );
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

export const tentativaService = {
  async iniciar(simuladoId: number) {
    const resposta = await api.post<{
      tentativa_id: number;
      simulado_id: number;
      total_questoes: number;
      duracao_segundos: number;
    }>(
      "/tentativas/iniciar",
      { simulado_id: simuladoId },
      { headers: autorizacao() }
    );

    return resposta.data;
  },

  async finalizar(
    tentativaId: number,
    respostas: RespostaTentativa[]
  ) {
    const resposta = await api.post<ResultadoTentativa>(
      `/tentativas/${tentativaId}/finalizar`,
      { respostas },
      { headers: autorizacao() }
    );

    return resposta.data;
  },

  async desistir(tentativaId: number) {
    const resposta = await api.post<{
      tentativa_id: number;
      status: "DESISTIDA";
      mensagem: string;
    }>(
      `/tentativas/${tentativaId}/desistir`,
      {},
      { headers: autorizacao() }
    );

    return resposta.data;
  },

  async historico() {
    const resposta = await api.get<{
      total: number;
      dados: HistoricoTentativa[];
    }>(
      "/tentativas",
      { headers: autorizacao() }
    );

    return resposta.data;
  }
};