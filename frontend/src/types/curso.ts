
export type NivelCurso =
  | "INICIANTE"
  | "INTERMEDIARIO"
  | "AVANCADO";

export interface Curso {
  id: number;
  nome: string;
  categoria: string;
  nivel: NivelCurso;
  descricao: string | null;
  link: string;
  carga_horaria: number | null;
}

export interface CategoriaCurso {
  categoria: string;
  quantidade: number;
}

export interface FiltrosCurso {
  categoria?: string;
  nivel?: NivelCurso;
  busca?: string;
}

export interface RespostaAPI<T> {
  total: number;
  dados: T[];
}

export interface CursoModulo {
  id: number;
  curso_id: number;
  titulo: string;
  ordem: number;
  descricao: string | null;
  carga_horaria: number | null;
  link: string;
}
