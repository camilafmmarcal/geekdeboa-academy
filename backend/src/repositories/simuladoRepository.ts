
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

export class SimuladoRepository {
  async listar(): Promise<Simulado[]> {
    const [rows] = await pool.query<Simulado[]>(
      `SELECT
         s.id,
         s.titulo,
         s.descricao,
         s.duracao_minutos,
         COUNT(sq.questao_id) AS quantidade_questoes
       FROM simulados s
       JOIN simulado_questoes sq
         ON sq.simulado_id = s.id
       WHERE s.status = 'PUBLICADO'
       GROUP BY
         s.id, s.titulo, s.descricao, s.duracao_minutos
       ORDER BY s.id DESC`
    );

    return rows;
  }

  async buscarPorId(id: number) {
    const [simulados] = await pool.execute<Simulado[]>(
      `SELECT
         s.id,
         s.titulo,
         s.descricao,
         s.duracao_minutos,
         COUNT(sq.questao_id) AS quantidade_questoes
       FROM simulados s
       JOIN simulado_questoes sq
         ON sq.simulado_id = s.id
       WHERE s.id = ?
         AND s.status = 'PUBLICADO'
       GROUP BY
         s.id, s.titulo, s.descricao, s.duracao_minutos`,
      [id]
    );

    if (simulados.length === 0) return null;

    const [questoes] = await pool.execute<QuestaoSimulado[]>(
      `SELECT
         q.id,
         sq.ordem,
         q.enunciado,
         q.dificuldade
       FROM simulado_questoes sq
       JOIN questoes q ON q.id = sq.questao_id
       WHERE sq.simulado_id = ?
         AND q.status = 'PUBLICADA'
       ORDER BY sq.ordem`,
      [id]
    );

    const [alternativas] = await pool.execute<AlternativaSimulado[]>(
      `SELECT
         alt.id,
         alt.questao_id,
         alt.letra,
         alt.texto
       FROM alternativas alt
       JOIN simulado_questoes sq
         ON sq.questao_id = alt.questao_id
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
          .map(({ id, letra, texto }) => ({
            id, letra, texto
          }))
      }))
    };
  }
}
