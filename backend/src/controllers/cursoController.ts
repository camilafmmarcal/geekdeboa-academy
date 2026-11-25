
import { Request, Response } from "express";
import { z } from "zod";
import { CursoService } from "../services/cursoService";

const filtrosSchema = z.object({
  categoria: z.string().trim().min(1).max(100).optional(),

  nivel: z.enum([
    "INICIANTE",
    "INTERMEDIARIO",
    "AVANCADO"
  ]).optional(),

  busca: z.string().trim().min(1).max(255).optional()
});

export class CursoController {
  constructor(
    private readonly service = new CursoService()
  ) {}

  listar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validacao = filtrosSchema.safeParse(req.query);

    if (!validacao.success) {
      res.status(400).json({
        erro: "Filtros inválidos.",
        detalhes: validacao.error.issues
      });
      return;
    }

    try {
      const dados = await this.service.listar(
        validacao.data
      );

      res.status(200).json({
        total: dados.length,
        dados
      });
    } catch (error) {
      console.error("Erro ao listar cursos:", error);

      res.status(500).json({
        erro: "Não foi possível consultar os cursos."
      });
    }
  };

  buscarPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const textoId = String(req.params.id);
    const id = Number(textoId);

    if (
      !/^[1-9]\d*$/.test(textoId) ||
      !Number.isSafeInteger(id)
    ) {
      res.status(400).json({
        erro: "ID do curso inválido."
      });
      return;
    }

    try {
      const curso = await this.service.buscarPorId(id);

      if (!curso) {
        res.status(404).json({
          erro: "Curso não encontrado."
        });
        return;
      }

      res.status(200).json(curso);
    } catch (error) {
      console.error("Erro ao consultar curso:", error);

      res.status(500).json({
        erro: "Não foi possível consultar o curso."
      });
    }
  };

  listarCategorias = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const dados = await this.service.listarCategorias();

      res.status(200).json({
        total: dados.length,
        dados
      });
    } catch (error) {
      console.error("Erro ao listar categorias:", error);

      res.status(500).json({
        erro: "Não foi possível consultar as categorias."
      });
    }
  };
}
