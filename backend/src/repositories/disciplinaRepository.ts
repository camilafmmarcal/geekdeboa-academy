
import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";

export interface Disciplina extends RowDataPacket {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: number;
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
}
