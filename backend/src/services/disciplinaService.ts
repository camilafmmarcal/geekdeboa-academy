
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
}
