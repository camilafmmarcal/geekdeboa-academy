
import { Request, Response } from "express";
import { SimuladoService } from "../services/simuladoService";

export class SimuladoController {
  constructor(
    private readonly service = new SimuladoService()
  ) {}

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const dados = await this.service.listar();

      res.status(200).json({
        total: dados.length,
        dados
      });
    } catch (error) {
      console.error("Erro ao listar simulados:", error);
      res.status(500).json({
        erro: "Não foi possível consultar os simulados."
      });
    }
  };

  buscarPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const textoId = String(req.params.id);

    if (!/^[1-9]\d*$/.test(textoId)) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }

    const id = Number(textoId);

    if (!Number.isSafeInteger(id)) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }

    try {
      const simulado = await this.service.buscarPorId(id);

      if (!simulado) {
        res.status(404).json({
          erro: "Simulado não encontrado."
        });
        return;
      }

      res.status(200).json(simulado);
    } catch (error) {
      console.error("Erro ao consultar simulado:", error);
      res.status(500).json({
        erro: "Não foi possível consultar o simulado."
      });
    }
  };
}
