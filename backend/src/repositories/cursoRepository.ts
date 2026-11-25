
import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";

export interface FiltrosCurso {
  categoria?: string;
  nivel?: "INICIANTE" | "INTERMEDIARIO" | "AVANCADO";
  busca?: string;
}

export interface Curso extends RowDataPacket {
  id: number;
  nome: string;
  categoria: string;
  nivel: string;
  descricao: string | null;
  link: string;
  carga_horaria: number | null;
}

export class CursoRepository {
  async listar(filtros: FiltrosCurso): Promise<Curso[]> {
    const condicoes = ["ativo = TRUE"];
    const valores: string[] = [];

    if (filtros.categoria) {
      condicoes.push("categoria = ?");
      valores.push(filtros.categoria);
    }

    if (filtros.nivel) {
      condicoes.push("nivel = ?");
      valores.push(filtros.nivel);
    }

    if (filtros.busca) {
      condicoes.push("(nome LIKE ? OR descricao LIKE ?)");

      const termo = `%${filtros.busca}%`;

      valores.push(termo, termo);
    }

    const [rows] = await pool.execute<Curso[]>(
      `SELECT
         id,
         nome,
         categoria,
         nivel,
         descricao,
         link,
         carga_horaria
       FROM cursos
       WHERE ${condicoes.join(" AND ")}
       ORDER BY categoria, nome`,
      valores
    );

    return rows;
  }

  async buscarPorId(id: number): Promise<Curso | null> {
    const [rows] = await pool.execute<Curso[]>(
      `SELECT
         id,
         nome,
         categoria,
         nivel,
         descricao,
         link,
         carga_horaria
       FROM cursos
       WHERE id = ?
         AND ativo = TRUE`,
      [id]
    );

    return rows[0] ?? null;
  }

  async listarCategorias() {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         categoria,
         COUNT(*) AS quantidade
       FROM cursos
       WHERE ativo = TRUE
       GROUP BY categoria
       ORDER BY categoria`
    );

    return rows;
  }
}
