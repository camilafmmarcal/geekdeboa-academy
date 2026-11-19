
import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";

export interface FiltrosQuestao {
  disciplina_id?: number;
  assunto_id?: number;
  banca_id?: number;
  dificuldade?: "FACIL" | "MEDIA" | "DIFICIL";
  pagina: number;
}

interface Questao extends RowDataPacket {
  id: number;
  enunciado: string;
  dificuldade: string;
  assunto: string;
  disciplina: string;
  banca: string | null;
}

interface Alternativa extends RowDataPacket {
  id: number;
  letra: string;
  texto: string;
}

export class QuestaoRepository {
  async listar(filtros: FiltrosQuestao) {
    const condicoes = ["q.status = 'PUBLICADA'"];
    const valores: Array<number | string> = [];

    if (filtros.disciplina_id) {
      condicoes.push("d.id = ?");
      valores.push(filtros.disciplina_id);
    }

    if (filtros.assunto_id) {
      condicoes.push("a.id = ?");
      valores.push(filtros.assunto_id);
    }

    if (filtros.banca_id) {
      condicoes.push("b.id = ?");
      valores.push(filtros.banca_id);
    }

    if (filtros.dificuldade) {
      condicoes.push("q.dificuldade = ?");
      valores.push(filtros.dificuldade);
    }

    const onde = condicoes.join(" AND ");
    const limite = 10;
    const offset = (filtros.pagina - 1) * limite;

    const [rows] = await pool.query<Questao[]>(
      `SELECT
         q.id,
         q.enunciado,
         q.dificuldade,
         a.nome AS assunto,
         d.nome AS disciplina,
         b.nome AS banca
       FROM questoes q
       JOIN assuntos a ON a.id = q.assunto_id
       JOIN disciplinas d ON d.id = a.disciplina_id
       LEFT JOIN concursos c ON c.id = q.concurso_id
       LEFT JOIN bancas b ON b.id = c.banca_id
       WHERE ${onde}
       ORDER BY q.id DESC
       LIMIT ? OFFSET ?`,
      [...valores, limite, offset]
    );

    return rows;
  }

  async buscarPorId(id: number) {
    const [questoes] = await pool.execute<Questao[]>(
      `SELECT
         q.id,
         q.enunciado,
         q.dificuldade,
         a.nome AS assunto,
         d.nome AS disciplina,
         b.nome AS banca
       FROM questoes q
       JOIN assuntos a ON a.id = q.assunto_id
       JOIN disciplinas d ON d.id = a.disciplina_id
       LEFT JOIN concursos c ON c.id = q.concurso_id
       LEFT JOIN bancas b ON b.id = c.banca_id
       WHERE q.id = ?
         AND q.status = 'PUBLICADA'`,
      [id]
    );

    if (!questoes.length) return null;

    const [alternativas] = await pool.execute<Alternativa[]>(
      `SELECT id, letra, texto
       FROM alternativas
       WHERE questao_id = ?
       ORDER BY letra`,
      [id]
    );

    return {
      ...questoes[0],
      alternativas
    };
  }
}
