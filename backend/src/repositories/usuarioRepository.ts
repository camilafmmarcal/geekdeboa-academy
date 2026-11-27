
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";

export interface UsuarioDB extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  perfil: "ALUNO" | "ADMIN";
  ativo: number;
}

export class UsuarioRepository {
  async buscarPorEmail(
    email: string
  ): Promise<UsuarioDB | null> {
    const [rows] = await pool.execute<UsuarioDB[]>(
      `SELECT id, nome, email, senha_hash, perfil, ativo
       FROM usuarios
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    return rows[0] ?? null;
  }

  async buscarPorId(
    id: number
  ): Promise<UsuarioDB | null> {
    const [rows] = await pool.execute<UsuarioDB[]>(
      `SELECT id, nome, email, senha_hash, perfil, ativo
       FROM usuarios
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return rows[0] ?? null;
  }

  async criar(
    nome: string,
    email: string,
    senhaHash: string
  ): Promise<number> {
    const [resultado] = await pool.execute<ResultSetHeader>(
      `INSERT INTO usuarios
         (nome, email, senha_hash, perfil, ativo)
       VALUES (?, ?, ?, 'ALUNO', TRUE)`,
      [nome, email, senhaHash]
    );

    return resultado.insertId;
  }
}