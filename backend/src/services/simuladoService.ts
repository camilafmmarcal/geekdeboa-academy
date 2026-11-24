
import { SimuladoRepository } from "../repositories/simuladoRepository";

export class SimuladoService {
  constructor(
    private readonly repository = new SimuladoRepository()
  ) {}

  async listar() {
    return this.repository.listar();
  }

  async buscarPorId(id: number) {
    return this.repository.buscarPorId(id);
  }
}
