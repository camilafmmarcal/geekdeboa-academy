
import { Router, Response } from "express";
import { z } from "zod";
import { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../config/database";

import {
  autenticar,
  RequisicaoAutenticada
} from "../middlewares/autenticacao";

const router = Router();

// =====================================================
// TIPOS
// =====================================================

interface UsuarioRow extends RowDataPacket {
  id: number;
}

interface SimuladoRow extends RowDataPacket {
  id: number;
  duracao_minutos: number;
  total: number;
}

interface TentativaRow extends RowDataPacket {
  id: number;
  usuario_id: number;
  simulado_id: number;
  status: "EM_ANDAMENTO" | "FINALIZADA" | "EXPIRADA" | "DESISTIDA";
  total_questoes: number;
  duracao_minutos: number;
  segundos_decorridos: number;
}

interface GabaritoRow extends RowDataPacket {
  questao_id: number;
  alternativa_id: number;
  letra: string;
  correta: number;
  comentario_gabarito: string | null;
}

interface HistoricoRow extends RowDataPacket {
  id: number;
  simulado: string;
  status: string;
  iniciado_em: Date;
  finalizado_em: Date | null;
  acertos: number | null;
  total_questoes: number | null;
}

interface DiagnosticoRow extends RowDataPacket {
  banco: string;
  vinculadas: number;
}

// =====================================================
// VALIDACOES
// =====================================================

const iniciarSchema = z.object({
  simulado_id: z.number().int().positive().safe()
}).strict();

const finalizarSchema = z.object({
  respostas: z.array(
    z.object({
      questao_id: z.number().int().positive().safe(),
      alternativa_id: z.number().int().positive().safe()
    }).strict()
  ).max(200)
}).strict();

function idValido(valor: unknown): number | null {
  const texto = String(valor);

  if (!/^[1-9]\d*$/.test(texto)) {
    return null;
  }

  const numero = Number(texto);

  if (!Number.isSafeInteger(numero)) {
    return null;
  }

  return numero;
}

function obterUsuarioId(
  req: RequisicaoAutenticada,
  res: Response
): number | null {
  const usuarioId = req.usuarioId;

  if (
    typeof usuarioId !== "number" ||
    !Number.isSafeInteger(usuarioId) ||
    usuarioId <= 0
  ) {
    res.status(401).json({
      erro: "Usuário não autenticado."
    });

    return null;
  }

  return usuarioId;
}

// =====================================================
// AUTENTICACAO OBRIGATORIA
// =====================================================

router.use(autenticar);

// =====================================================
// POST /api/tentativas/iniciar
// =====================================================

router.post(
  "/iniciar",
  async (
    req: RequisicaoAutenticada,
    res: Response
  ): Promise<void> => {
    const usuarioId = obterUsuarioId(req, res);

    if (usuarioId === null) {
      return;
    }

    const validacao = iniciarSchema.safeParse(req.body);

    if (!validacao.success) {
      res.status(400).json({
        erro: "Informe um simulado_id válido."
      });
      return;
    }

    const simuladoId = validacao.data.simulado_id;

    try {
      // Confirma que o usuário continua ativo.
      const [usuarios] = await pool.execute<UsuarioRow[]>(
        `SELECT id
         FROM usuarios
         WHERE id = ?
           AND ativo = TRUE
         LIMIT 1`,
        [usuarioId]
      );

      if (usuarios.length === 0) {
        res.status(401).json({
          erro: "Conta indisponível."
        });
        return;
      }

      // Identifica o simulado e suas questões publicadas.
      const [simulados] =
        await pool.execute<SimuladoRow[]>(
          `SELECT
             s.id,
             s.duracao_minutos,
             COUNT(sq.questao_id) AS total
           FROM simulados s
           INNER JOIN simulado_questoes sq
             ON sq.simulado_id = s.id
           INNER JOIN questoes q
             ON q.id = sq.questao_id
           WHERE s.id = ?
             AND s.status = 'PUBLICADO'
             AND q.status = 'PUBLICADA'
           GROUP BY
             s.id,
             s.duracao_minutos`,
          [simuladoId]
        );

      const simulado = simulados[0];

      if (!simulado) {
        res.status(404).json({
          erro: "Simulado não disponível."
        });
        return;
      }

      const totalQuestoes = Number(simulado.total);
      const duracaoMinutos = Number(
        simulado.duracao_minutos
      );

      if (
        !Number.isSafeInteger(totalQuestoes) ||
        totalQuestoes <= 0 ||
        !Number.isSafeInteger(duracaoMinutos) ||
        duracaoMinutos <= 0
      ) {
        res.status(409).json({
          erro: "Configuração do simulado inválida."
        });
        return;
      }

      // Cria uma tentativa associada ao JWT autenticado.
      const [registro] =
        await pool.execute<ResultSetHeader>(
          `INSERT INTO tentativas (
             usuario_id,
             simulado_id,
             status,
             total_questoes
           )
           VALUES (
             ?,
             ?,
             'EM_ANDAMENTO',
             ?
           )`,
          [
            usuarioId,
            simuladoId,
            totalQuestoes
          ]
        );

      res.status(201).json({
        tentativa_id: registro.insertId,
        simulado_id: simuladoId,
        total_questoes: totalQuestoes,
        duracao_segundos: duracaoMinutos * 60
      });
    } catch (error) {
      console.error(
        "Erro ao iniciar tentativa:",
        error
      );

      res.status(500).json({
        erro: "Não foi possível iniciar a tentativa."
      });
    }
  }
);

// =====================================================
// POST /api/tentativas/:id/finalizar
// =====================================================

router.post(
  "/:id/finalizar",
  async (
    req: RequisicaoAutenticada,
    res: Response
  ): Promise<void> => {
    const usuarioId = obterUsuarioId(req, res);

    if (usuarioId === null) {
      return;
    }

    const tentativaId = idValido(req.params.id);

    if (tentativaId === null) {
      res.status(400).json({
        erro: "Identificador da tentativa inválido."
      });
      return;
    }

    const validacao = finalizarSchema.safeParse(req.body);

    if (!validacao.success) {
      res.status(400).json({
        erro: "Dados de finalização inválidos."
      });
      return;
    }

    const respostas = validacao.data.respostas;

    // Impede enviar a mesma questão duas vezes.
    const idsQuestoes = respostas.map(
      (resposta) => resposta.questao_id
    );

    if (
      new Set(idsQuestoes).size !== idsQuestoes.length
    ) {
      res.status(400).json({
        erro: "Há questões repetidas nas respostas."
      });
      return;
    }

    const conexao = await pool.getConnection();

    try {
      await conexao.beginTransaction();

      // ===============================================
      // 1. CONSULTAR E BLOQUEAR A TENTATIVA
      // ===============================================

      const [tentativas] =
        await conexao.execute<TentativaRow[]>(
          `SELECT
             t.id,
             t.usuario_id,
             t.simulado_id,
             t.status,
             t.total_questoes,
             s.duracao_minutos,
             TIMESTAMPDIFF(
               SECOND,
               t.iniciado_em,
               NOW()
             ) AS segundos_decorridos
           FROM tentativas t
           INNER JOIN simulados s
             ON s.id = t.simulado_id
           INNER JOIN usuarios u
             ON u.id = t.usuario_id
           WHERE t.id = ?
             AND t.usuario_id = ?
             AND u.ativo = TRUE
           FOR UPDATE`,
          [tentativaId, usuarioId]
        );

      const tentativa = tentativas[0];

      if (!tentativa) {
        await conexao.rollback();

        res.status(404).json({
          erro: "Tentativa não encontrada."
        });
        return;
      }

      if (tentativa.status !== "EM_ANDAMENTO") {
        await conexao.rollback();

        res.status(409).json({
          erro: "Esta tentativa já foi encerrada."
        });
        return;
      }

      // ===============================================
      // 2. NORMALIZAR DADOS DO MYSQL
      // ===============================================

      const simuladoId = Number(
        tentativa.simulado_id
      );

      const totalRegistrado = Number(
        tentativa.total_questoes
      );

      const duracaoMinutos = Number(
        tentativa.duracao_minutos
      );

      const segundosDecorridos = Number(
        tentativa.segundos_decorridos
      );

      if (
        !Number.isSafeInteger(simuladoId) ||
        simuladoId <= 0 ||
        !Number.isSafeInteger(totalRegistrado) ||
        totalRegistrado <= 0 ||
        !Number.isSafeInteger(duracaoMinutos) ||
        duracaoMinutos <= 0 ||
        !Number.isFinite(segundosDecorridos)
      ) {
        await conexao.rollback();

        res.status(409).json({
          erro:
            "Dados da tentativa inconsistentes."
        });
        return;
      }

      // ===============================================
      // 3. VALIDAR PRAZO
      // ===============================================

      // Tolerância operacional de 10 segundos.
      const limiteSegundos =
        duracaoMinutos * 60 + 10;

      if (segundosDecorridos > limiteSegundos) {
        await conexao.execute(
          `UPDATE tentativas
           SET status = 'EXPIRADA',
               finalizado_em = NOW()
           WHERE id = ?`,
          [tentativaId]
        );

        await conexao.commit();

        res.status(409).json({
          erro:
            "O tempo da tentativa expirou. " +
            "Inicie uma nova avaliação."
        });
        return;
      }

      // ===============================================
      // 4. CONSULTAR GABARITOS
      // ===============================================

      const [gabaritos] =
        await conexao.execute<GabaritoRow[]>(
          `SELECT
             sq.questao_id,
             a.id AS alternativa_id,
             a.letra,
             a.correta,
             q.comentario_gabarito
           FROM simulado_questoes sq
           INNER JOIN questoes q
             ON q.id = sq.questao_id
           INNER JOIN alternativas a
             ON a.questao_id = sq.questao_id
           WHERE sq.simulado_id = ?
             AND q.status = 'PUBLICADA'
           ORDER BY
             sq.ordem,
             a.letra`,
          [simuladoId]
        );

      // Diagnóstico: não expõe senhas nem gabaritos.
      console.log(
        "Diagnóstico da finalização:",
        {
          tentativaId,
          simuladoId,
          totalRegistrado,
          alternativasEncontradas: gabaritos.length
        }
      );

      // ===============================================
      // 5. AGRUPAR ALTERNATIVAS POR QUESTAO
      // ===============================================

      const alternativasPorQuestao =
        new Map<number, GabaritoRow[]>();

      for (const alternativa of gabaritos) {
        const questaoId = Number(
          alternativa.questao_id
        );

        const alternativas =
          alternativasPorQuestao.get(questaoId) ?? [];

        alternativas.push(alternativa);

        alternativasPorQuestao.set(
          questaoId,
          alternativas
        );
      }

      const totalEncontrado =
        alternativasPorQuestao.size;

      console.log(
        "Validação da composição do simulado:",
        {
          tentativaId,
          simuladoId,
          totalRegistrado,
          totalEncontrado
        }
      );

      // ===============================================
      // 6. DIAGNOSTICAR AUSENCIA DE GABARITOS
      // ===============================================

      if (totalEncontrado === 0) {
        const [diagnostico] =
          await conexao.execute<DiagnosticoRow[]>(
            `SELECT
               DATABASE() AS banco,
               COUNT(*) AS vinculadas
             FROM simulado_questoes
             WHERE simulado_id = ?`,
            [simuladoId]
          );

        console.error(
          "Nenhum gabarito encontrado:",
          {
            tentativaId,
            simuladoId,
            banco: diagnostico[0]?.banco,
            vinculadas: Number(
              diagnostico[0]?.vinculadas ?? 0
            )
          }
        );

        await conexao.rollback();

        res.status(409).json({
          erro:
            "Não foi possível localizar os gabaritos " +
            "do simulado. Verifique os logs do backend."
        });
        return;
      }

      // ===============================================
      // 7. CONFERIR COMPOSICAO DO SIMULADO
      // ===============================================

      if (totalEncontrado !== totalRegistrado) {
        await conexao.rollback();

        res.status(409).json({
          erro:
            "A composição do simulado está inconsistente. " +
            "Verifique as questões vinculadas."
        });
        return;
      }

      // ===============================================
      // 8. VALIDAR TODOS OS GABARITOS
      // ===============================================

      for (
        const [questaoId, alternativas]
        of alternativasPorQuestao
      ) {
        const corretas = alternativas.filter(
          (alternativa) =>
            Number(alternativa.correta) === 1
        );

        if (
          alternativas.length !== 5 ||
          corretas.length !== 1
        ) {
          console.error(
            "Gabarito inconsistente:",
            {
              questaoId,
              alternativas: alternativas.length,
              corretas: corretas.length
            }
          );

          await conexao.rollback();

          res.status(409).json({
            erro:
              "Uma questão do simulado possui " +
              "alternativas ou gabarito inconsistentes."
          });
          return;
        }
      }

      // ===============================================
      // 9. VALIDAR RESPOSTAS RECEBIDAS
      // ===============================================

      const respostasPorQuestao =
        new Map<number, number>();

      for (const resposta of respostas) {
        const alternativas =
          alternativasPorQuestao.get(
            resposta.questao_id
          );

        if (!alternativas) {
          await conexao.rollback();

          res.status(422).json({
            erro:
              "Uma questão enviada não pertence " +
              "a este simulado."
          });
          return;
        }

        const alternativaPertence =
          alternativas.some(
            (alternativa) =>
              Number(alternativa.alternativa_id) ===
              resposta.alternativa_id
          );

        if (!alternativaPertence) {
          await conexao.rollback();

          res.status(422).json({
            erro:
              "Uma alternativa enviada não pertence " +
              "à questão informada."
          });
          return;
        }

        respostasPorQuestao.set(
          resposta.questao_id,
          resposta.alternativa_id
        );
      }

      // ===============================================
      // 10. CORRIGIR E SALVAR RESPOSTAS
      // ===============================================

      let acertos = 0;

      const questoesCorrigidas: {
        questao_id: number;
        alternativa_id: number | null;
        correta: boolean;
        letra_correta: string;
        comentario: string | null;
      }[] = [];

      for (
        const [questaoId, alternativas]
        of alternativasPorQuestao
      ) {
        const alternativaCorreta =
          alternativas.find(
            (alternativa) =>
              Number(alternativa.correta) === 1
          )!;

        const alternativaSelecionada =
          respostasPorQuestao.get(questaoId) ?? null;

        const acertou =
          alternativaSelecionada !== null &&
          alternativaSelecionada ===
          Number(alternativaCorreta.alternativa_id);

        if (acertou) {
          acertos++;
        }

        // Salva somente questões respondidas.
        if (alternativaSelecionada !== null) {
          await conexao.execute(
            `INSERT INTO respostas (
               tentativa_id,
               questao_id,
               alternativa_id
             )
             VALUES (?, ?, ?)`,
            [
              tentativaId,
              questaoId,
              alternativaSelecionada
            ]
          );
        }

        questoesCorrigidas.push({
          questao_id: questaoId,
          alternativa_id: alternativaSelecionada,
          correta: acertou,
          letra_correta: alternativaCorreta.letra,
          comentario:
            alternativaCorreta.comentario_gabarito
        });
      }

      // ===============================================
      // 11. FINALIZAR TENTATIVA NO MYSQL
      // ===============================================

      const [atualizacao] =
        await conexao.execute<ResultSetHeader>(
          `UPDATE tentativas
           SET
             status = 'FINALIZADA',
             finalizado_em = NOW(),
             acertos = ?,
             total_questoes = ?
           WHERE id = ?
             AND usuario_id = ?
             AND status = 'EM_ANDAMENTO'`,
          [
            acertos,
            totalRegistrado,
            tentativaId,
            usuarioId
          ]
        );

      if (atualizacao.affectedRows !== 1) {
        throw new Error(
          "Não foi possível atualizar o status da tentativa."
        );
      }

      await conexao.commit();

      // ===============================================
      // 12. DEVOLVER RESULTADO
      // ===============================================

      const percentual = Number(
        (
          (acertos / totalRegistrado) * 100
        ).toFixed(2)
      );

      console.log(
        "Tentativa finalizada com sucesso:",
        {
          tentativaId,
          simuladoId,
          acertos,
          totalQuestoes: totalRegistrado,
          percentual
        }
      );

      res.status(200).json({
        tentativa_id: tentativaId,
        total_questoes: totalRegistrado,
        respondidas: respostasPorQuestao.size,
        acertos,
        percentual,
        questoes: questoesCorrigidas
      });
    } catch (error) {
      try {
        await conexao.rollback();
      } catch (rollbackError) {
        console.error(
          "Erro ao reverter transação:",
          rollbackError
        );
      }

      console.error(
        "Erro ao finalizar tentativa:",
        error
      );

      res.status(500).json({
        erro:
          "Não foi possível finalizar a tentativa."
      });
    } finally {
      conexao.release();
    }
  }
);

// =====================================================
// =====================================================
// POST /api/tentativas/:id/desistir
// =====================================================
router.post(
  "/:id/desistir",
  async (req: RequisicaoAutenticada, res: Response): Promise<void> => {
    const usuarioId = obterUsuarioId(req, res);
    if (usuarioId === null) return;

    const tentativaId = idValido(req.params.id);
    if (tentativaId === null) {
      res.status(400).json({ erro: "Identificador inválido." });
      return;
    }

    try {
      const [resultado] = await pool.execute<ResultSetHeader>(
        `UPDATE tentativas t
         INNER JOIN usuarios u ON u.id = t.usuario_id
         SET t.status = 'DESISTIDA',
             t.finalizado_em = NOW(),
             t.acertos = NULL
         WHERE t.id = ?
           AND t.usuario_id = ?
           AND t.status = 'EM_ANDAMENTO'
           AND u.ativo = TRUE`,
        [tentativaId, usuarioId]
      );
      if (resultado.affectedRows !== 1) {
        res.status(409).json({
          erro: "Tentativa não encontrada ou já encerrada."
        });
        return;
      }
      res.status(200).json({
        tentativa_id: tentativaId,
        status: "DESISTIDA",
        mensagem: "Desistência registrada."
      });
    } catch (error) {
      console.error("Erro ao desistir:", error);
      res.status(500).json({ erro: "Falha ao registrar desistência." });
    }
  }
);

// GET /api/tentativas
// HISTORICO DO ESTUDANTE
// =====================================================

router.get(
  "/",
  async (
    req: RequisicaoAutenticada,
    res: Response
  ): Promise<void> => {
    const usuarioId = obterUsuarioId(req, res);

    if (usuarioId === null) {
      return;
    }

    try {
      const [rows] =
        await pool.execute<HistoricoRow[]>(
          `SELECT
             t.id,
             s.titulo AS simulado,
             t.status,
             t.iniciado_em,
             t.finalizado_em,
             t.acertos,
             t.total_questoes
           FROM tentativas t
           INNER JOIN simulados s
             ON s.id = t.simulado_id
           INNER JOIN usuarios u
             ON u.id = t.usuario_id
           WHERE t.usuario_id = ?
             AND u.ativo = TRUE
           ORDER BY t.id DESC
           LIMIT 100`,
          [usuarioId]
        );

      res.status(200).json({
        total: rows.length,
        dados: rows
      });
    } catch (error) {
      console.error(
        "Erro ao consultar histórico:",
        error
      );

      res.status(500).json({
        erro:
          "Não foi possível consultar o histórico."
      });
    }
  }
);

export default router;
