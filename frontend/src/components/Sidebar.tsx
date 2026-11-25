
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  ChartColumn,
  Sparkles,
  Info
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const menu = [
  {
    nome: "Visão geral",
    rota: "/",
    icone: LayoutDashboard
  },
  {
    nome: "Cursos",
    rota: "/cursos",
    icone: GraduationCap
  },
  {
    nome: "Banco de questões",
    rota: "/questoes",
    icone: BookOpen
  },
  {
    nome: "Simulados",
    rota: "/simulados",
    icone: ClipboardList
  },
  {
    nome: "Desempenho",
    rota: "/desempenho",
    icone: ChartColumn
  },
  {
    nome: "Geek AI",
    rota: "/assistente",
    icone: Sparkles
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Logo />

      <div className="menu-label">
        PLATAFORMA
      </div>

      <nav className="sidebar-menu">
        {menu.map(({ nome, rota, icone: Icone }) => (
          <NavLink
            key={rota}
            to={rota}
            end={rota === "/"}
            className={({ isActive }) =>
              `menu-link ${isActive ? "active" : ""}`
            }
          >
            <Icone size={20} />
            <span>{nome}</span>
          </NavLink>
        ))}
      </nav>

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
