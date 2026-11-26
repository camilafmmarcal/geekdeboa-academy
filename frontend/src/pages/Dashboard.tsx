
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  Layers,
  ArrowRight,
  Code2,
  BrainCircuit,
  ShieldCheck,
  AlertCircle,
  RefreshCw
} from "lucide-react";

import { dashboardService } from "../services/dashboardService";

import type { DadosDashboard } from "../types/dashboard";

const indicadoresVisuais = [
  {
    chave: "cursos",
    titulo: "Cursos disponíveis",
    icone: GraduationCap,
    cor: "blue"
  },
  {
    chave: "disciplinas",
    titulo: "Disciplinas",
    icone: BookOpen,
    cor: "purple"
  },
  {
    chave: "assuntos",
    titulo: "Assuntos",
    icone: Layers,
    cor: "cyan"
  },
  {
    chave: "simulados",
    titulo: "Simulados publicados",
    icone: ClipboardList,
    cor: "green"
  }
] as const;

const trilhas = [
  {
    titulo: "Programação",
    descricao:
      "Desenvolva suas habilidades em lógica e linguagens.",
    icone: Code2
  },
  {
    titulo: "Inteligência Artificial",
    descricao:
      "Explore conceitos e aplicações de IA.",
    icone: BrainCircuit
  },
  {
    titulo: "Segurança da Informação",
    descricao:
      "Aprenda fundamentos de proteção digital.",
    icone: ShieldCheck
  }
];

export default function Dashboard() {
  const [dados, setDados] =
    useState<DadosDashboard | null>(null);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState("");

  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setCarregando(true);
    setErro("");

    dashboardService
      .carregar(controller.signal)
      .then((resultado) => {
        if (!controller.signal.aborted) {
          setDados(resultado);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setErro(
            "Não foi possível carregar os dados do Dashboard."
          );

          setDados(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      });

    return () => controller.abort();
  }, [atualizacao]);

  const areasDisponiveis = trilhas.filter((trilha) =>
    dados?.categoriasDisponiveis?.includes(trilha.titulo)
  );

  const indicadores = indicadoresVisuais.map((item) => ({
    ...item,
    valor: dados?.indicadores[item.chave] ?? null
  }));

  function atualizar() {
    setAtualizacao((valor) => valor + 1);
  }

  return (
    <div className="dashboard">

      <section className="welcome">
        <h1>Olá, estudante!</h1>
        <p>Sua jornada em tecnologia começa aqui.</p>
      </section>

      <section className="hero">
        <div className="hero-content">

          <span className="hero-label">
            APRENDA. PRATIQUE. EVOLUA.
          </span>

          <h2>
            Prepare-se para o seu futuro em TI.
          </h2>

          <p>
            Explore recursos educacionais,
            pratique questões e prepare-se
            para concursos da área de tecnologia.
          </p>

          <div className="hero-buttons">
            <Link
              to="/cursos"
              className="btn-primary"
            >
              Explorar cursos
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/questoes"
              className="btn-outline"
            >
              Praticar questões
            </Link>
          </div>

        </div>

        <GraduationCap
          className="hero-illustration"
          size={200}
          strokeWidth={1}
          aria-hidden="true"
        />
      </section>

      <section
        className="stats-grid"
        aria-label="Indicadores da plataforma"
        aria-busy={carregando}
      >
        {indicadores.map(
          ({ chave, titulo, valor, icone: Icone, cor }) => (
            <article
              className="stat-card"
              key={chave}
            >
              <div className={`stat-icon ${cor}`}>
                <Icone size={24} />
              </div>

              <div>
                <strong className="stat-value">
                  {carregando
                    ? "…"
                    : valor === null
                      ? "—"
                      : valor}
                </strong>

                <p>{titulo}</p>
              </div>
            </article>
          )
        )}
      </section>

      {carregando && (
        <div
          className="dashboard-message"
          role="status"
        >
          Consultando indicadores da plataforma...
        </div>
      )}

      {!carregando && (erro || Boolean(dados?.avisos.length)) && (
        <div
          className="dashboard-alert"
          role="alert"
        >
          <AlertCircle size={21} />

          <div>
            <strong>
              Alguns dados não puderam ser carregados
            </strong>

            <p>
              {erro ||
                dados?.avisos.join(" ")}
            </p>
          </div>

          <button
            type="button"
            className="dashboard-refresh"
            onClick={atualizar}
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      )}

      <section className="learning-section">

        <div className="section-heading">
          <div>
            <h2>Explore áreas de conhecimento</h2>

            <p>
              Encontre conteúdos disponíveis
              em nosso catálogo.
            </p>
          </div>

          <Link
            to="/cursos"
            className="text-link"
          >
            Ver catálogo
            <ArrowRight size={16} />
          </Link>
        </div>

        {!carregando && areasDisponiveis.length > 0 ? (

          <div className="learning-grid">
            {areasDisponiveis.map(
              ({ titulo, descricao, icone: Icone }) => (
                <article
                  className="learning-card"
                  key={titulo}
                >
                  <div className="learning-icon">
                    <Icone size={32} />
                  </div>

                  <h3>{titulo}</h3>
                  <p>{descricao}</p>

                  <Link
                    to={`/cursos?categoria=${encodeURIComponent(titulo)}`}
                    className="text-link"
                  >
                    Explorar área
                    <ArrowRight size={16} />
                  </Link>
                </article>
              )
            )}
          </div>

        ) : !carregando && dados?.categoriasDisponiveis !== null ? (

          <div className="dashboard-message">
            Nenhuma das áreas destacadas possui
            cursos ativos no momento.
            Consulte o catálogo completo.
          </div>

        ) : null}

      </section>

      <div className="demo-notice">
        Ambiente acadêmico demonstrativo.
        Os indicadores são consultados na API REST
        e representam o conteúdo cadastrado,
        não o desempenho individual do estudante.
      </div>

    </div>
  );
}
