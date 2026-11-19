
import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";

export interface Disciplina extends RowDataPacket {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: number;
}

export interface Assunto extends RowDataPacket {
  id: number;
  disciplina_id: number;
  nome: string;
  descricao: string | null;
}

export class DisciplinaRepository {
  async listar(): Promise<Disciplina[]> {
    const [rows] = await pool.query<Disciplina[]>(
      `SELECT id, nome, descricao, ativo
       FROM disciplinas
       WHERE ativo = TRUE
       ORDER BY nome`
    );

    return rows;
  }

  async buscarPorId(id: number): Promise<Disciplina | null> {
    const [rows] = await pool.execute<Disciplina[]>(
      `SELECT id, nome, descricao, ativo
       FROM disciplinas
       WHERE id = ? AND ativo = TRUE`,
      [id]
    );

    return rows[0] ?? null;
  }

  async listarAssuntos(disciplinaId: number): Promise<Assunto[]> {
    const [rows] = await pool.execute<Assunto[]>(
      `SELECT id, disciplina_id, nome, descricao
       FROM assuntos
       WHERE disciplina_id = ?
       ORDER BY nome`,
      [disciplinaId]
    );

    return rows;
  }
}
