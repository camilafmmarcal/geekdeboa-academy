
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  Clock3,
  ExternalLink,
  Layers,
  LoaderCircle,
  AlertCircle,
  ListChecks,
  GraduationCap
} from "lucide-react";

import { cursoService } from "../services/cursoService";

import type {
  Curso,
  CursoModulo
} from "../types/curso";

import "../styles/cursoDetalhes.css";

function linkValido(link: string): boolean {
  try {
    const url = new URL(link);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export default function CursoDetalhes() {
  const { id } = useParams<{ id: string }>();

  const [curso, setCurso] = useState<Curso | null>(null);
  const [modulos, setModulos] = useState<CursoModulo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro("");
      setCurso(null);
      setModulos([]);

      const cursoId = Number(id);

      if (!Number.isSafeInteger(cursoId) || cursoId <= 0) {
        setErro("Identificador do curso inválido.");
        setCarregando(false);
        return;
      }

      try {
        const [dadosCurso, dadosModulos] = await Promise.all([
          cursoService.buscarPorId(cursoId),
          cursoService.listarModulos(
            cursoId,
            controller.signal
          )
        ]);

        if (ativo) {
          setCurso(dadosCurso);
          setModulos(dadosModulos.dados);
        }
      } catch {
        if (ativo && !controller.signal.aborted) {
          setErro(
            "Não foi possível carregar os detalhes do curso."
          );
        }
      } finally {
        if (ativo && !controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
      controller.abort();
    };
  }, [id, atualizacao]);

  if (carregando) {
    return (
      <div className="catalog-state" role="status">
        <LoaderCircle className="spinner" size={38} />
        <h3>Carregando módulos...</h3>
      </div>
    );
  }

  if (erro || !curso) {
    return (
      <div className="catalog-state error-state">
        <AlertCircle size={38} />
        <h3>Não foi possível abrir o curso</h3>
        <p>{erro || "Curso não encontrado."}</p>

        <button
          type="button"
          className="retry-button"
          onClick={() => setAtualizacao((n) => n + 1)}
        >
          Tentar novamente
        </button>

        <Link to="/cursos" className="text-link">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const cargaTotalConhecida =
    modulos.length > 0 &&
    modulos.every(
      (modulo) => modulo.carga_horaria !== null
    );

  const horas = cargaTotalConhecida
    ? modulos.reduce(
        (soma, modulo) =>
          soma + (modulo.carga_horaria ?? 0),
        0
      )
    : null;

  const ehPython = curso.nome.toLowerCase().includes("python");

  return (
    <div className="detalhes-page">

      <Link to="/cursos" className="detalhes-voltar">
        <ArrowLeft size={17} />
        Voltar ao catálogo
      </Link>

      <section className="detalhes-hero">
        <span className="hero-label">
          CURSO EM VÍDEO
        </span>

        <GraduationCap size={42} />

        <h1>{curso.nome}</h1>

        <p>
          {curso.descricao ||
            "Explore os módulos deste curso."}
        </p>

        <div className="detalhes-indicadores">
          <span>
            <Layers size={18} />
            {modulos.length} módulos
          </span>

          {horas !== null && (
            <span>
              <Clock3 size={18} />
              {horas} horas
            </span>
          )}
        </div>
      </section>

      <section className="detalhes-orientacoes">
        <div className="detalhes-titulo">
          <ListChecks size={24} />
          <h2>Como acessar os módulos</h2>
        </div>

        <ol>
          <li>
            Escolha um dos módulos disponíveis abaixo.
            Recomendamos seguir a ordem apresentada.
          </li>

          <li>
            Clique em "Acessar módulo" para abrir
            o site oficial do Curso em Vídeo.
          </li>

          <li>
            Entre na sua conta ou realize o cadastro
            caso a plataforma solicite.
          </li>

          <li>
            Consulte as orientações e os requisitos
            de acesso e certificação no site oficial.
          </li>

          <li>
            Retorne ao Geek de Boa Academy
            para acessar os demais módulos.
          </li>
        </ol>
      </section>

      <section className="detalhes-conteudo">
        <div className="detalhes-heading">
          <h2>
            {ehPython
              ? "Mundos do Python"
              : "Módulos do curso"}
          </h2>

          <p>
            Selecione a etapa que deseja estudar.
          </p>
        </div>

        {modulos.length === 0 ? (
          <div className="catalog-state">
            <BookOpen size={38} />
            <h3>Nenhum módulo cadastrado</h3>
            <p>
              Os módulos deste curso ainda não
              estão disponíveis no catálogo.
            </p>
          </div>
        ) : (
          <div className="detalhes-grid">
            {modulos.map((modulo) => (
              <article
                className="detalhes-modulo-card"
                key={modulo.id}
              >
                <div className="detalhes-modulo-cabecalho">
                  <span className="detalhes-ordem">
                    {String(modulo.ordem).padStart(2, "0")}
                  </span>

                  <span className="detalhes-horas">
                    <Clock3 size={15} />
                    {modulo.carga_horaria !== null
                      ? `${modulo.carga_horaria} horas`
                      : "Duração não informada"}
                  </span>
                </div>

                <h3>{modulo.titulo}</h3>

                <p>
                  {modulo.descricao ||
                    `Acesse o conteúdo da etapa ${
                      modulo.ordem
                    } na plataforma oficial.`}
                </p>

                {linkValido(modulo.link) ? (
                  <a
                    className="course-button"
                    href={modulo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ehPython
                      ? "Acessar mundo"
                      : "Acessar módulo"}

                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className="course-unavailable">
                    Link indisponível
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="detalhes-aviso">
        <BookOpen size={23} />

        <p>
          O Geek de Boa Academy organiza e divulga
          recursos de aprendizagem. As aulas,
          inscrições e certificações são oferecidas
          pelo Curso em Vídeo. A disponibilidade
          deve ser confirmada no site da instituição.
        </p>
      </section>
    </div>
  );
}
