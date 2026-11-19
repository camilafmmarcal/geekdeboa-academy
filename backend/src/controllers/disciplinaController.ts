
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

  listarAssuntos = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      res.status(400).json({
        erro: "ID da disciplina inválido."
      });
      return;
    }

    try {
      const resultado = await this.service.listarAssuntos(id);

      if (!resultado) {
        res.status(404).json({
          erro: "Disciplina não encontrada."
        });
        return;
      }

      res.status(200).json(resultado);
    } catch (error) {
      console.error("Erro ao listar assuntos:", error);

      res.status(500).json({
        erro: "Não foi possível consultar os assuntos."
      });
    }
  };
}
