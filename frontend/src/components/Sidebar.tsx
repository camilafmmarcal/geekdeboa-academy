
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  ChartColumn,
  Sparkles,
  Info,
  Award,
  Code2,
  Server,
  BookOpenCheck,
  CodeXml
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const grupos = [
  {
    titulo: "PLATAFORMA",
    itens: [
      { nome: "Visão geral", rota: "/", icone: LayoutDashboard },
      { nome: "Cursos", rota: "/cursos", icone: GraduationCap },
      { nome: "Banco de questões", rota: "/questoes", icone: BookOpen },
      { nome: "Simulados", rota: "/simulados", icone: ClipboardList },
      { nome: "Desempenho", rota: "/desempenho", icone: ChartColumn }
    ]
  },
  {
    titulo: "OPORTUNIDADES",
    itens: [
      { nome: "Programa Eu Capacito", rota: "/eu-capacito", icone: Award },
      { nome: "freeCodeCamp", rota: "/recursos/freecodecamp", icone: CodeXml },
      { nome: "Microsoft Learn", rota: "/recursos/microsoft-learn", icone: BookOpenCheck }
    ]
  },
  {
    titulo: "DOCUMENTAÇÃO TÉCNICA",
    itens: [
      { nome: "Node.js", rota: "/recursos/nodejs", icone: Server },
      { nome: "React", rota: "/recursos/react", icone: Code2 }
    ]
  },
  {
    titulo: "INTELIGÊNCIA ARTIFICIAL",
    itens: [
      { nome: "Geek AI", rota: "/assistente", icone: Sparkles }
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Logo />

      {grupos.map((grupo) => (
        <section className="sidebar-group" key={grupo.titulo}>
          <div className="menu-label">{grupo.titulo}</div>

          <nav className="sidebar-menu" aria-label={grupo.titulo}>
            {grupo.itens.map(({ nome, rota, icone: Icone }) => (
              <NavLink
                key={rota}
                to={rota}
                end={rota === "/"}
                title={nome}
                aria-label={nome}
                className={({ isActive }) =>
                  `menu-link ${isActive ? "active" : ""}`
                }
              >
                <Icone size={20} />
                <span>{nome}</span>
              </NavLink>
            ))}
          </nav>
        </section>
      ))}

      <div className="sidebar-footer">
        <Info size={18} />

        <div>
          <strong>Projeto Integrado II</strong>
          <p>Versão acadêmica 2.0</p>
        </div>
      </div>
    </aside>
  );
}
