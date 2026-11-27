
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
  total_modulos: number;
}

export interface CursoModulo extends RowDataPacket {
  id: number;
  curso_id: number;
  titulo: string;
  ordem: number;
  descricao: string | null;
  carga_horaria: number | null;
  link: string;
}

export class CursoRepository {

async listarModulos(cursoId: number): Promise<CursoModulo[]> {
  const [rows] = await pool.execute<CursoModulo[]>(
    `SELECT
       m.id,
       m.curso_id,
       m.titulo,
       m.ordem,
       m.descricao,
       m.carga_horaria,
       m.link
     FROM curso_modulos m
     INNER JOIN cursos c ON c.id = m.curso_id
     WHERE m.curso_id = ?
       AND m.ativo = TRUE
       AND c.ativo = TRUE
       AND LOWER(c.nome) NOT LIKE '%cisco%'
       AND LOWER(c.link) NOT LIKE '%cisco%' AND LOWER(c.link) NOT LIKE '%netacad%' AND LOWER(c.link) NOT LIKE '%skillsforall%'
     ORDER BY m.ordem ASC`,
    [cursoId]
  );

  return rows;
}

  

async listar(filtros: FiltrosCurso): Promise<Curso[]> {
  const condicoes = [
    "c.ativo = TRUE",
    "LOWER(c.nome) NOT LIKE '%cisco%'",
    "LOWER(c.link) NOT LIKE '%cisco%' AND LOWER(c.link) NOT LIKE '%netacad%' AND LOWER(c.link) NOT LIKE '%skillsforall%'"
  ];
  const valores: string[] = [];

  if (filtros.categoria) {
    condicoes.push("c.categoria = ?");
    valores.push(filtros.categoria);
  }

  if (filtros.nivel) {
    condicoes.push("c.nivel = ?");
    valores.push(filtros.nivel);
  }

  if (filtros.busca) {
    condicoes.push(
      "(c.nome LIKE ? OR c.descricao LIKE ?)"
    );

    const termo = `%${filtros.busca}%`;
    valores.push(termo, termo);
  }

  const [rows] = await pool.execute<Curso[]>(
    `SELECT
       c.id,
       c.nome,
       c.categoria,
       c.nivel,
       c.descricao,
       c.link,
       c.carga_horaria,
       (
         SELECT COUNT(*)
         FROM curso_modulos m
         WHERE m.curso_id = c.id
           AND m.ativo = TRUE
       ) AS total_modulos
     FROM cursos c
     WHERE ${condicoes.join(" AND ")}
     ORDER BY c.categoria, c.nome`,
    valores
  );

  return rows;
}

async buscarPorId(id: number): Promise<Curso | null> {
  const [rows] = await pool.execute<Curso[]>(
    `SELECT
       c.id,
       c.nome,
       c.categoria,
       c.nivel,
       c.descricao,
       c.link,
       c.carga_horaria,
       (
         SELECT COUNT(*)
         FROM curso_modulos m
         WHERE m.curso_id = c.id
           AND m.ativo = TRUE
       ) AS total_modulos
     FROM cursos c
     WHERE c.id = ?
       AND c.ativo = TRUE
       AND LOWER(c.nome) NOT LIKE '%cisco%'
       AND LOWER(c.link) NOT LIKE '%cisco%' AND LOWER(c.link) NOT LIKE '%netacad%' AND LOWER(c.link) NOT LIKE '%skillsforall%'`,
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
         AND LOWER(nome) NOT LIKE '%cisco%'
         AND LOWER(link) NOT LIKE '%cisco%' AND LOWER(link) NOT LIKE '%netacad%' AND LOWER(link) NOT LIKE '%skillsforall%'
       GROUP BY categoria
       ORDER BY categoria`
    );

    return rows;
  }
}
