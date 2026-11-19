
import {
  FiltrosQuestao,
  QuestaoRepository
} from "../repositories/questaoRepository";

export class QuestaoService {
  constructor(
    private readonly repository = new QuestaoRepository()
  ) {}

  async listar(filtros: FiltrosQuestao) {
    return this.repository.listar(filtros);
  }

  async buscarPorId(id: number) {
    return this.repository.buscarPorId(id);
  }
}
