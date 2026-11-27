
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  ArrowLeft,
  Send,
  CheckCircle2
} from "lucide-react";

import {
  recuperacaoSenhaService
} from "../services/recuperacaoSenhaService";

import "../styles/autenticacao.css";
import "../styles/recuperacaoSenha.css";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (enviando) return;

    setEnviando(true);
    setErro("");

    try {
      await recuperacaoSenhaService.solicitar(
        email.trim()
      );

      setConcluido(true);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 429) {
        setErro(
          "Muitas solicitações. Tente novamente mais tarde."
        );
      } else {
        setErro(
          "Não foi possível processar a solicitação. " +
          "Tente novamente."
        );
      }
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

          <h1>Recuperar senha</h1>

          <p>
            Informe o e-mail utilizado no cadastro.
            Enviaremos um link para criar uma nova senha.
          </p>
        </div>

        {!concluido ? (
          <form
            className="autenticacao-formulario"
            onSubmit={(evento) => void enviar(evento)}
          >
            <div>
              <label htmlFor="recuperar-email">
                E-mail cadastrado
              </label>

              <input
                id="recuperar-email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
              />
            </div>

            {erro && (
              <p className="autenticacao-erro" role="alert">
                {erro}
              </p>
            )}

            <button
              type="submit"
              className="autenticacao-enviar"
              disabled={enviando}
            >
              <Send size={17} />
              {enviando
                ? "Enviando..."
                : "Enviar link de recuperação"}
            </button>
          </form>
        ) : (
          <div
            className="recuperacao-confirmacao"
            role="status"
          >
            <CheckCircle2 size={35} />

            <h2>Solicitação recebida</h2>

            <p>
              Se o e-mail estiver cadastrado,
              você receberá um link para redefinir
              sua senha. Confira também a pasta de spam.
            </p>
          </div>
        )}

        <Link
          to="/entrar"
          className="recuperacao-voltar"
        >
          <ArrowLeft size={17} />
          Voltar ao login
        </Link>
      </section>
    </div>
  );
}
