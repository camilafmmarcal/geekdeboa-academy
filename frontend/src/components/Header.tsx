
import { useCallback, useEffect, useState } from "react";
import { CircleUserRound, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { authService } from "../services/authService";
import type { UsuarioAutenticado } from "../services/authService";

export default function Header() {
  const navigate = useNavigate();

  const [usuario, setUsuario] =
    useState<UsuarioAutenticado | null>(null);

  const atualizarUsuario = useCallback(async () => {
    if (!authService.obterToken()) {
      setUsuario(null);
      return;
    }

    try {
      const perfil = await authService.perfil();
      setUsuario(perfil);
    } catch {
      authService.sair();
      setUsuario(null);
    }
  }, []);

  useEffect(() => {
    void atualizarUsuario();

    const atualizar = () => {
      void atualizarUsuario();
    };

    window.addEventListener(
      "geekdeboa-auth",
      atualizar
    );

    return () => {
      window.removeEventListener(
        "geekdeboa-auth",
        atualizar
      );
    };
  }, [atualizarUsuario]);

  function sair() {
    authService.sair();
    setUsuario(null);
    navigate("/entrar");
  }

  return (
    <header className="header">
      <div className="header-title">
        <strong>Área do estudante</strong>
        <span>Aprenda. Pratique. Evolua.</span>
      </div>

      <div className="header-actions">
        <div className="user-profile">
          <CircleUserRound size={36} />

          <div>
            <strong>
              {usuario
                ? usuario.nome
                : "Visitante"}
            </strong>

            <span>
              {usuario
                ? "Estudante autenticado"
                : "Acesso demonstrativo"}
            </span>
          </div>

          {usuario ? (
            <button
              type="button"
              onClick={sair}
              title="Sair da conta"
              aria-label="Sair da conta"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#1769d2"
              }}
            >
              <LogOut size={20} />
            </button>
          ) : (
            <Link
              to="/entrar"
              style={{
                marginLeft: 12,
                color: "#1769d2",
                fontWeight: 700,
                fontSize: 13
              }}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}