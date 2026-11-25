
import {
  Code2,
  Database,
  BrainCircuit,
  ShieldCheck,
  Globe,
  Network,
  GraduationCap,
  Clock3,
  ExternalLink,
  Layers
} from "lucide-react";

import type { Curso } from "../types/curso";
import { Link } from "react-router-dom";

interface Props {
  curso: Curso;
}

const niveis = {
  INICIANTE: "Iniciante",
  INTERMEDIARIO: "Intermediário",
  AVANCADO: "Avançado"
};

function identificarInstituicao(link: string) {
  try {
    const dominio = new URL(link).hostname;

    if (dominio.endsWith(".fiap.com.br"))
      return "FIAP";

    if (dominio === "ev.org.br" ||
        dominio.endsWith(".ev.org.br"))
      return "Fundação Bradesco";

    if (dominio.includes("cursoemvideo.com"))
      return "Curso em Vídeo";

    if (dominio.includes("freecodecamp.org"))
      return "freeCodeCamp";

    if (dominio.includes("microsoft.com"))
      return "Microsoft Learn";

    if (dominio.includes("netacad.com"))
      return "Cisco Networking Academy";

    if (dominio.includes("github.com"))
      return "GitHub";

    return "Plataforma externa";
  } catch {
    return "Plataforma externa";
  }
}

function definirCategoria(categoria: string) {
  switch (categoria) {
    case "Programação":
      return { icone: Code2, cor: "programacao" };

    case "Banco de Dados":
      return { icone: Database, cor: "database" };

    case "Inteligência Artificial":
      return { icone: BrainCircuit, cor: "ia" };

    case "Segurança da Informação":
      return { icone: ShieldCheck, cor: "seguranca" };

    case "Desenvolvimento Web":
      return { icone: Globe, cor: "web" };

    case "Redes de Computadores":
      return { icone: Network, cor: "redes" };

    case "Engenharia de Software":
      return { icone: Layers, cor: "engenharia" };

    default:
      return {
        icone: GraduationCap,
        cor: "geral"
      };
  }
}

export default function CourseCard({ curso }: Props) {
  const { icone: Icone, cor } =
    definirCategoria(curso.categoria);

  const instituicao =
    identificarInstituicao(curso.link);

  const possuiModulos = [2, 4].includes(curso.id);

  let linkSeguro: string | null = null;

  try {
    const url = new URL(curso.link);

    if (url.protocol === "https:" ||
        url.protocol === "http:") {
      linkSeguro = url.href;
    }
  } catch {
    linkSeguro = null;
  }

  return (
    <article className="course-card">

      <div className={`course-cover ${cor}`}>
        <Icone size={58} strokeWidth={1.5} />

        <span className="course-provider">
          {instituicao}
        </span>
      </div>

      <div className="course-body">

        <div className="course-tags">
          <span className="category-tag">
            {curso.categoria}
          </span>

          <span
            className={
              `level-tag ${curso.nivel.toLowerCase()}`
            }
          >
            {niveis[curso.nivel]}
          </span>
        </div>

        <h3>{curso.nome}</h3>

        <p className="course-description">
          {curso.descricao ||
            "Descrição não informada."}
        </p>

        <div className="course-meta">
          <Clock3 size={17} />

          <span>
            {curso.carga_horaria !== null
              ? `${curso.carga_horaria} horas`
              : "Carga horária não informada"}
          </span>
        </div>

        
{possuiModulos ? (
  <Link
    to={`/cursos/${curso.id}`}
    className="course-button"
  >
    Ver módulos do curso
    <Layers size={16} />
  </Link>
) : linkSeguro ? (
  <a
    href={linkSeguro}
    target="_blank"
    rel="noopener noreferrer"
    className="course-button"
  >
    Acessar curso
    <ExternalLink size={16} />
  </a>
) : (
  <span className="course-unavailable">
    Link indisponível
  </span>
)}

      </div>
    </article>
  );
}
