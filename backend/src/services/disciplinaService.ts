
import {
  DisciplinaRepository
} from "../repositories/disciplinaRepository";

export class DisciplinaService {
  constructor(
    private readonly repository = new DisciplinaRepository()
  ) {}

  async listarDisciplinas() {
    return this.repository.listar();
  }

  async listarAssuntos(disciplinaId: number) {
    const disciplina = await this.repository.buscarPorId(disciplinaId);

    if (!disciplina) {
      return null;
    }

    const assuntos = await this.repository.listarAssuntos(disciplinaId);

    return {
      disciplina: {
        id: disciplina.id,
        nome: disciplina.nome
      },
      total: assuntos.length,
      dados: assuntos
    };
  }
}
