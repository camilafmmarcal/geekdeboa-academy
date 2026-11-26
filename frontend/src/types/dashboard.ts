
export interface Disciplina {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: number | boolean;
}

export interface Assunto {
  id: number;
  disciplina_id: number;
  nome: string;
  descricao: string | null;
}

export interface RespostaAssuntos {
  disciplina: {
    id: number;
    nome: string;
  };
  total: number;
  dados: Assunto[];
}

export interface SimuladoResumo {
  id: number;
  titulo: string;
  descricao: string | null;
  duracao_minutos: number;
  quantidade_questoes: number;
}

export interface IndicadoresDashboard {
  cursos: number | null;
  disciplinas: number | null;
  assuntos: number | null;
  simulados: number | null;
}

export interface DadosDashboard {
  indicadores: IndicadoresDashboard;
  categoriasDisponiveis: string[] | null;
  avisos: string[];
}
