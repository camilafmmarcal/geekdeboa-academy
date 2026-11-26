
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

interface CorrecaoRow extends RowDataPacket {
  alternativa_id: number;
  letra: string;
  correta: number;
  comentario_gabarito: string | null;
}

export interface ResultadoCorrecao {
  correta: boolean;
  letraCorreta: string;
  comentario: string | null;
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

async corrigirResposta(
  questaoId: number,
  alternativaId: number
): Promise<ResultadoCorrecao | null> {
  const [rows] = await pool.execute<CorrecaoRow[]>(
    `SELECT
       a.id AS alternativa_id,
       a.letra,
       a.correta,
       q.comentario_gabarito
     FROM alternativas a
     INNER JOIN questoes q
       ON q.id = a.questao_id
     WHERE q.id = ?
       AND q.status = 'PUBLICADA'
     ORDER BY a.letra`,
    [questaoId]
  );

  if (rows.length === 0) {
    return null;
  }

  const selecionada = rows.find(
    (alternativa) => alternativa.alternativa_id === alternativaId
  );

  if (!selecionada) {
    return null;
  }

  const corretas = rows.filter(
    (alternativa) => alternativa.correta === 1
  );

  if (corretas.length !== 1) {
    throw new Error(
      `Gabarito inconsistente na questão ${questaoId}`
    );
  }

  return {
    correta: selecionada.correta === 1,
    letraCorreta: corretas[0].letra,
    comentario: selecionada.comentario_gabarito
  };
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
