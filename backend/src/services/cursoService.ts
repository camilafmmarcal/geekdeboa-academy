
import {
  CursoRepository,
  FiltrosCurso
} from "../repositories/cursoRepository";

export class CursoService {
  constructor(
    private readonly repository = new CursoRepository()
  ) {}

  async listar(filtros: FiltrosCurso) {
    return this.repository.listar(filtros);
  }

  async buscarPorId(id: number) {
    return this.repository.buscarPorId(id);
  }

  async listarCategorias() {
    return this.repository.listarCategorias();
  }
  async listarModulos(cursoId: number) {
  return this.repository.listarModulos(cursoId);
}
}
