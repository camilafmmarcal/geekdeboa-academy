
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  Layers,
  ArrowRight,
  Code2,
  BrainCircuit,
  ShieldCheck
} from "lucide-react";

import { Link } from "react-router-dom";

const indicadores = [
  {
    titulo: "Cursos e recursos",
    valor: 17,
    icone: GraduationCap,
    cor: "blue"
  },
  {
    titulo: "Disciplinas",
    valor: 9,
    icone: BookOpen,
    cor: "purple"
  },
  {
    titulo: "Assuntos",
    valor: 14,
    icone: Layers,
    cor: "cyan"
  },
  {
    titulo: "Simulados",
    valor: 1,
    icone: ClipboardList,
    cor: "green"
  }
];

const trilhas = [
  {
    titulo: "Programação",
    descricao: "Desenvolva suas habilidades em lógica e linguagens.",
    icone: Code2
  },
  {
    titulo: "Inteligência Artificial",
    descricao: "Explore conceitos e aplicações de IA.",
    icone: BrainCircuit
  },
  {
    titulo: "Segurança da Informação",
    descricao: "Aprenda fundamentos de proteção digital.",
    icone: ShieldCheck
  }
];

export default function Dashboard() {
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
            Explore recursos educacionais, pratique
            questões e prepare-se para concursos
            da área de tecnologia.
          </p>

          <div className="hero-buttons">
            <Link to="/cursos" className="btn-primary">
              Explorar cursos
              <ArrowRight size={18} />
            </Link>

            <Link to="/questoes" className="btn-outline">
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

      <section className="stats-grid">
        {indicadores.map(
          ({ titulo, valor, icone: Icone, cor }) => (
            <article className="stat-card" key={titulo}>
              <div className={`stat-icon ${cor}`}>
                <Icone size={24} />
              </div>

              <div>
                <strong className="stat-value">
                  {valor}
                </strong>
                <p>{titulo}</p>
              </div>
            </article>
          )
        )}
      </section>

      <section className="learning-section">
        <div className="section-heading">
          <div>
            <h2>Explore áreas de conhecimento</h2>
            <p>Encontre conteúdos para sua formação.</p>
          </div>

          <Link to="/cursos" className="text-link">
            Ver catálogo
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="learning-grid">
          {trilhas.map(
            ({ titulo, descricao, icone: Icone }) => (
              <article className="learning-card" key={titulo}>

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
      </section>

      <div className="demo-notice">
        Ambiente acadêmico demonstrativo.
        Os indicadores serão integrados à API
        na próxima etapa.
      </div>

    </div>
  );
}
