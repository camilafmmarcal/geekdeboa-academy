
import { Request, Response } from "express";
import { QuestaoService } from "../services/questaoService";

const service = new QuestaoService();

function inteiroPositivo(valor: unknown): number | undefined {
  if (valor === undefined) return undefined;

  const texto = String(valor);
  if (!/^[1-9]\d*$/.test(texto)) return NaN;

  const numero = Number(texto);
  return Number.isSafeInteger(numero) ? numero : NaN;
}

export class QuestaoController {
  listar = async (req: Request, res: Response): Promise<void> => {
    const disciplina_id = inteiroPositivo(req.query.disciplina_id);
    const assunto_id = inteiroPositivo(req.query.assunto_id);
    const banca_id = inteiroPositivo(req.query.banca_id);
    const pagina = inteiroPositivo(req.query.pagina) ?? 1;

    const dificuldade = req.query.dificuldade;

    const ids = [disciplina_id, assunto_id, banca_id, pagina];

    if (ids.some(v => v !== undefined && !Number.isSafeInteger(v))) {
      res.status(400).json({ erro: "Parâmetros numéricos inválidos." });
      return;
    }

    const dificuldades = ["FACIL", "MEDIA", "DIFICIL"] as const;

    if (
      dificuldade !== undefined &&
      !dificuldades.includes(dificuldade as typeof dificuldades[number])
    ) {
      res.status(400).json({ erro: "Dificuldade inválida." });
      return;
    }

    try {
      const dados = await service.listar({
        disciplina_id,
        assunto_id,
        banca_id,
        dificuldade: dificuldade as "FACIL" | "MEDIA" | "DIFICIL" | undefined,
        pagina
      });

      res.status(200).json({
        pagina,
        quantidade: dados.length,
        dados
      });
    } catch (error) {
      console.error("Erro ao listar questões:", error);
      res.status(500).json({ erro: "Erro ao consultar questões." });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = inteiroPositivo(req.params.id);

    if (!id || !Number.isSafeInteger(id)) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }

    try {
      const questao = await service.buscarPorId(id);

      if (!questao) {
        res.status(404).json({ erro: "Questão não encontrada." });
        return;
      }

      res.status(200).json(questao);
    } catch (error) {
      console.error("Erro ao consultar questão:", error);
      res.status(500).json({ erro: "Erro ao consultar questão." });
    }
  };
}
