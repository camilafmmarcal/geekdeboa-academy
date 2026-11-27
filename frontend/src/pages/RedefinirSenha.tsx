
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Link } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2
} from "lucide-react";

import {
  recuperacaoSenhaService
} from "../services/recuperacaoSenhaService";

import "../styles/autenticacao.css";
import "../styles/recuperacaoSenha.css";

function senhaValida(senha: string) {
  return (
    senha.length >= 8 &&
    senha.length <= 72 &&
    new TextEncoder().encode(senha).length <= 72 &&
    /[A-Za-z]/.test(senha) &&
    /[0-9]/.test(senha) &&
    /[^A-Za-z0-9\s]/.test(senha)
  );
}

export default function RedefinirSenha() {
  // Preserva o token em memória e retira-o da URL.
  const [token] = useState(() =>
    new URLSearchParams(
      window.location.search
    ).get("token") ?? ""
  );

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] =
    useState(false);

  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    );
  }, []);

  const regras = [
    {
      nome: "Pelo menos 8 caracteres",
      valido: senha.length >= 8
    },
    {
      nome: "Pelo menos uma letra",
      valido: /[A-Za-z]/.test(senha)
    },
    {
      nome: "Pelo menos um número",
      valido: /[0-9]/.test(senha)
    },
    {
      nome: "Pelo menos um caractere especial",
      valido: /[^A-Za-z0-9\s]/.test(senha)
    }
  ];

  async function enviar(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (enviando || !token) return;

    if (
      !senhaValida(senha) ||
      senha !== confirmacao
    ) {
      setErro(
        "Confira os requisitos e a confirmação da senha."
      );
      return;
    }

    setEnviando(true);
    setErro("");

    try {
      await recuperacaoSenhaService.redefinir(
        token,
        senha
      );

      setSenha("");
      setConfirmacao("");
      setConcluido(true);
    } catch (error) {
      const erroApi = isAxiosError(error)
        ? error.response?.data?.erro
        : undefined;

      setErro(
        typeof erroApi === "string"
          ? erroApi
          : "Não foi possível redefinir a senha."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="autenticacao-page">
      <section className="autenticacao-card">
        <div className="autenticacao-topo">
          <span className="autenticacao-marca">
            Geek de Boa Academy 2.0
          </span>

          <h1>
            {concluido
              ? "Senha atualizada"
              : "Criar nova senha"}
          </h1>

          <p>
            {concluido
              ? "Sua senha foi redefinida com sucesso."
              : "Defina uma nova senha para sua conta."}
          </p>
        </div>

        {concluido ? (
          <div className="recuperacao-confirmacao">
            <CheckCircle2 size={38} />

            <p>
              Você já pode acessar sua conta
              utilizando a nova senha.
            </p>

            <Link
              className="recuperacao-link-primario"
              to="/entrar"
            >
              Ir para o login
            </Link>
          </div>
        ) : !/^[a-f0-9]{64}$/.test(token) ? (
          <div className="recuperacao-confirmacao">
            <LockKeyhole size={35} />

            <p>
              O link de recuperação está ausente ou
              é inválido. Solicite um novo link.
            </p>

            <Link
              className="recuperacao-link-primario"
              to="/recuperar-senha"
            >
              Solicitar novo link
            </Link>
          </div>
        ) : (
          <form
            className="autenticacao-formulario"
            onSubmit={(evento) => void enviar(evento)}
          >
            <div>
              <label htmlFor="nova-senha">
                Nova senha
              </label>

              <div className="autenticacao-senha-campo">
                <input
                  id="nova-senha"
                  type={
                    mostrarSenha ? "text" : "password"
                  }
                  value={senha}
                  onChange={(e) =>
                    setSenha(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="autenticacao-visibilidade"
                  onClick={() =>
                    setMostrarSenha((v) => !v)
                  }
                  aria-label={
                    mostrarSenha
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                >
                  {mostrarSenha
                    ? <EyeOff size={20} />
                    : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="autenticacao-requisitos">
              <strong>A senha deve conter:</strong>

              {regras.map((item) => (
                <div
                  key={item.nome}
                  className={
                    item.valido ? "valido" : "pendente"
                  }
                >
                  <CheckCircle2 size={16} />
                  <span>{item.nome}</span>
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="confirmar-nova-senha">
                Confirmar nova senha
              </label>

              <div className="autenticacao-senha-campo">
                <input
                  id="confirmar-nova-senha"
                  type={
                    mostrarConfirmacao
                      ? "text"
                      : "password"
                  }
                  value={confirmacao}
                  onChange={(e) =>
                    setConfirmacao(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="autenticacao-visibilidade"
                  onClick={() =>
                    setMostrarConfirmacao(
                      (v) => !v
                    )
                  }
                  aria-label={
                    mostrarConfirmacao
                      ? "Ocultar confirmação"
                      : "Mostrar confirmação"
                  }
                >
                  {mostrarConfirmacao
                    ? <EyeOff size={20} />
                    : <Eye size={20} />}
                </button>
              </div>

              {confirmacao.length > 0 && (
                <small>
                  {confirmacao === senha
                    ? "As senhas coincidem."
                    : "As senhas não coincidem."}
                </small>
              )}
            </div>

            {erro && (
              <p
                className="autenticacao-erro"
                role="alert"
              >
                {erro}
              </p>
            )}

            <button
              type="submit"
              className="autenticacao-enviar"
              disabled={
                enviando ||
                !senhaValida(senha) ||
                senha !== confirmacao
              }
            >
              {enviando
                ? "Salvando..."
                : "Redefinir senha"}
            </button>

            <Link
              to="/recuperar-senha"
              className="recuperacao-voltar"
            >
              Solicitar outro link
            </Link>
          </form>
        )}
      </section>
    </div>
  );
}
