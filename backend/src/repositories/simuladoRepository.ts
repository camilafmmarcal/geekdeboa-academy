import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";

interface Simulado extends RowDataPacket {
  id: number;
  titulo: string;
  descricao: string | null;
  duracao_minutos: number;
  quantidade_questoes: number;
}
interface QuestaoSimulado extends RowDataPacket {
  id: number;
  ordem: number;
  enunciado: string;
  dificuldade: string;
}
interface AlternativaSimulado extends RowDataPacket {
  id: number;
  questao_id: number;
  letra: string;
  texto: string;
}
interface CorrecaoRow extends RowDataPacket {
  questao_id: number;
  alternativa_id: number;
  letra: string;
  correta: number;
  comentario_gabarito: string | null;
}
export interface RespostaSimulado {
  questao_id: number;
  alternativa_id: number;
}

export class SimuladoRepository {
  async listar(): Promise<Simulado[]> {
    const [rows] = await pool.query<Simulado[]>(
      `SELECT s.id, s.titulo, s.descricao, s.duracao_minutos,
              COUNT(sq.questao_id) AS quantidade_questoes
       FROM simulados s
       JOIN simulado_questoes sq ON sq.simulado_id = s.id
       JOIN questoes q ON q.id = sq.questao_id AND q.status = 'PUBLICADA'
       WHERE s.status = 'PUBLICADO'
       GROUP BY s.id, s.titulo, s.descricao, s.duracao_minutos
       ORDER BY s.id DESC`
    );
    return rows;
  }

  async buscarPorId(id: number) {
    const [simulados] = await pool.execute<Simulado[]>(
      `SELECT s.id, s.titulo, s.descricao, s.duracao_minutos,
              COUNT(q.id) AS quantidade_questoes
       FROM simulados s
       JOIN simulado_questoes sq ON sq.simulado_id = s.id
       JOIN questoes q ON q.id = sq.questao_id AND q.status = 'PUBLICADA'
       WHERE s.id = ? AND s.status = 'PUBLICADO'
       GROUP BY s.id, s.titulo, s.descricao, s.duracao_minutos`,
      [id]
    );
    if (!simulados.length) return null;

    const [questoes] = await pool.execute<QuestaoSimulado[]>(
      `SELECT q.id, sq.ordem, q.enunciado, q.dificuldade
       FROM simulado_questoes sq
       JOIN questoes q ON q.id = sq.questao_id AND q.status = 'PUBLICADA'
       WHERE sq.simulado_id = ? ORDER BY sq.ordem`,
      [id]
    );
    const [alternativas] = await pool.execute<AlternativaSimulado[]>(
      `SELECT alt.id, alt.questao_id, alt.letra, alt.texto
       FROM alternativas alt
       JOIN simulado_questoes sq ON sq.questao_id = alt.questao_id
       JOIN questoes q ON q.id = sq.questao_id AND q.status = 'PUBLICADA'
       WHERE sq.simulado_id = ?
       ORDER BY alt.questao_id, alt.letra`,
      [id]
    );
    return {
      ...simulados[0],
      questoes: questoes.map(q => ({
        ...q,
        alternativas: alternativas
          .filter(a => a.questao_id === q.id)
          .map(({ id, letra, texto }) => ({ id, letra, texto }))
      }))
    };
  }

  async corrigir(id: number, respostas: RespostaSimulado[]) {
    const [simulados] = await pool.execute<Simulado[]>(
      `SELECT id, titulo, duracao_minutos
       FROM simulados WHERE id = ? AND status = 'PUBLICADO'`,
      [id]
    );
    if (!simulados.length) return { tipo: "NAO_ENCONTRADO" as const };

    const [rows] = await pool.execute<CorrecaoRow[]>(
      `SELECT q.id AS questao_id, alt.id AS alternativa_id,
              alt.letra, alt.correta, q.comentario_gabarito
       FROM simulado_questoes sq
       JOIN questoes q ON q.id = sq.questao_id AND q.status = 'PUBLICADA'
       JOIN alternativas alt ON alt.questao_id = q.id
       WHERE sq.simulado_id = ?
       ORDER BY sq.ordem, alt.letra`,
      [id]
    );
    const porQuestao = new Map<number, CorrecaoRow[]>();
    for (const row of rows) {
      const grupo = porQuestao.get(row.questao_id) ?? [];
      grupo.push(row);
      porQuestao.set(row.questao_id, grupo);
    }
    if (!porQuestao.size) return { tipo: "SEM_QUESTOES" as const };

    // Evita validar incorretamente provas com gabaritos incompletos.
    for (const [questaoId, alternativas] of porQuestao) {
      if (alternativas.length !== 5 || alternativas.filter(a => Number(a.correta) === 1).length !== 1) {
        throw new Error(`Gabarito inconsistente na questão ${questaoId}`);
      }
    }
    const mapaRespostas = new Map<number, number>();
    for (const resposta of respostas) {
      if (!porQuestao.has(resposta.questao_id)) {
        return { tipo: "RESPOSTA_INVALIDA" as const };
      }
      if (!porQuestao.get(resposta.questao_id)!.some(a => a.alternativa_id === resposta.alternativa_id)) {
        return { tipo: "RESPOSTA_INVALIDA" as const };
      }
      mapaRespostas.set(resposta.questao_id, resposta.alternativa_id);
    }

    let acertos = 0;
    const questoes = Array.from(porQuestao, ([questaoId, alternativas]) => {
      const gabarito = alternativas.find(a => Number(a.correta) === 1)!;
      const alternativaId = mapaRespostas.get(questaoId) ?? null;
      const acertou = alternativaId === gabarito.alternativa_id;
      if (acertou) acertos++;
      return {
        questao_id: questaoId,
        alternativa_id: alternativaId,
        letra_correta: gabarito.letra,
        correta: acertou,
        comentario: gabarito.comentario_gabarito
      };
    });
    return {
      tipo: "CORRIGIDO" as const,
      resultado: {
        simulado_id: id,
        total_questoes: porQuestao.size,
        respondidas: respostas.length,
        acertos,
        percentual: Math.round((10000 * acertos) / porQuestao.size) / 100,
        questoes
      }
    };
  }
}
