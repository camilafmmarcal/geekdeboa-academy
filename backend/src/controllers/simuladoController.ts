import { Request, Response } from "express";
import { z } from "zod";
import { SimuladoService } from "../services/simuladoService";

const positivo = z.number().int().positive().safe();
const corpoSchema = z.object({
  respostas: z.array(z.object({
    questao_id: positivo,
    alternativa_id: positivo
  }).strict()).max(500)
}).strict();

export class SimuladoController {
  constructor(private readonly service = new SimuladoService()) {}

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const dados = await this.service.listar();
      res.status(200).json({ total: dados.length, dados });
    } catch (error) {
      console.error("Erro ao listar simulados:", error);
      res.status(500).json({ erro: "Não foi possível consultar os simulados." });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = this.lerId(req.params.id);
    if (!id) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }
    try {
      const simulado = await this.service.buscarPorId(id);
      if (!simulado) {
        res.status(404).json({ erro: "Simulado não encontrado." });
        return;
      }
      res.status(200).json(simulado);
    } catch (error) {
      console.error("Erro ao consultar simulado:", error);
      res.status(500).json({ erro: "Não foi possível consultar o simulado." });
    }
  };

  finalizar = async (req: Request, res: Response): Promise<void> => {
    const id = this.lerId(req.params.id);
    if (!id) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }
    const corpo = corpoSchema.safeParse(req.body);
    if (!corpo.success) {
      res.status(400).json({ erro: "Formato das respostas inválido." });
      return;
    }
    const ids = corpo.data.respostas.map(r => r.questao_id);
    if (new Set(ids).size !== ids.length) {
      res.status(400).json({ erro: "Questão respondida mais de uma vez." });
      return;
    }
    try {
      const resposta = await this.service.finalizar(id, corpo.data.respostas);
      if (resposta.tipo === "NAO_ENCONTRADO") {
        res.status(404).json({ erro: "Simulado não encontrado." });
        return;
      }
      if (resposta.tipo === "SEM_QUESTOES") {
        res.status(409).json({ erro: "Simulado sem questões disponíveis." });
        return;
      }
      if (resposta.tipo === "RESPOSTA_INVALIDA") {
        res.status(422).json({ erro: "Questão ou alternativa não pertence ao simulado." });
        return;
      }
      res.status(200).json(resposta.resultado);
    } catch (error) {
      console.error("Erro ao finalizar simulado:", error);
      res.status(500).json({ erro: "Não foi possível corrigir o simulado." });
    }
  };

  private lerId(valor: unknown): number | null {
    const texto = String(valor);
    if (!/^[1-9]\d*$/.test(texto)) return null;
    const id = Number(texto);
    return Number.isSafeInteger(id) ? id : null;
  }
}
