
import {
  FiltrosQuestao,
  QuestaoRepository
} from "../repositories/questaoRepository";

export class QuestaoService {
  constructor(
    private readonly repository = new QuestaoRepository()
  ) {}

async corrigirResposta(
  questaoId: number,
  alternativaId: number
) {
  const questao = await this.repository.buscarPorId(
    questaoId
  );

  if (!questao) {
    return {
      status: "QUESTAO_NAO_ENCONTRADA" as const
    };
  }

  const resultado = await this.repository.corrigirResposta(
    questaoId,
    alternativaId
  );

  if (!resultado) {
    return {
      status: "ALTERNATIVA_INVALIDA" as const
    };
  }

  return {
    status: "CORRIGIDA" as const,
    resultado
  };
}

  async listar(filtros: FiltrosQuestao) {
    return this.repository.listar(filtros);
  }

  async buscarPorId(id: number) {
    return this.repository.buscarPorId(id);
  }
}
