
import { Request, Response } from "express";
import { DisciplinaService } from "../services/disciplinaService";

export class DisciplinaController {
  constructor(
    private readonly service = new DisciplinaService()
  ) {}

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const disciplinas = await this.service.listarDisciplinas();

      res.status(200).json({
        total: disciplinas.length,
        dados: disciplinas
      });
    } catch (error) {
      console.error("Erro ao listar disciplinas:", error);

      res.status(500).json({
        erro: "Não foi possível consultar as disciplinas."
      });
    }
  };
}
