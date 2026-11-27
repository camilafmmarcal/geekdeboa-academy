
import { useState } from "react";
import type { FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import "../styles/recuperacaoSenha.css";

import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  CheckCircle2,
  Circle
} from "lucide-react";

import { authService } from "../services/authService";

import "../styles/autenticacao.css";

type Modo = "login" | "cadastro";

function validarSenha(senha: string) {
  return {
    tamanho: senha.length >= 8,
    letra: /[A-Za-z]/.test(senha),
    numero: /[0-9]/.test(senha),
    especial: /[^A-Za-z0-9\s]/.test(senha),
    limite:
      senha.length <= 72 &&
      new TextEncoder().encode(senha).length <= 72
  };
}

function mensagemErro(error: unknown): string {
  if (isAxiosError(error)) {
    const erroApi = error.response?.data?.erro;

    if (typeof erroApi === "string") {
      return erroApi;
    }
  }

  return "Não foi possível concluir a operação.";
}

export default function Autenticacao() {
  const navigate = useNavigate();

  const [modo, setModo] = useState<Modo>("login");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] =
    useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const requisitos = validarSenha(senha);

  const senhaValida =
    Object.values(requisitos).every(Boolean);

  const senhasConferem =
    senha.length > 0 && senha === confirmarSenha;

  function alternarModo(novoModo: Modo) {
    setModo(novoModo);
    setErro("");
    setSucesso("");
    setSenha("");
    setConfirmarSenha("");
    setMostrarSenha(false);
    setMostrarConfirmacao(false);
  }

  async function enviar(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (carregando) return;

    setErro("");
    setSucesso("");
{modo === "login" && (
  <Link
    to="/recuperar-senha"
    className="recuperacao-voltar"
    style={{
      alignSelf: "flex-end",
      marginTop: 0
    }}
  >
    Esqueceu sua senha?
  </Link>
)}
    if (modo === "cadastro") {
      if (!senhaValida) {
        setErro(
          "A senha não atende aos requisitos de segurança."
        );
        return;
      }

      if (!senhasConferem) {
        setErro("As senhas informadas não coincidem.");
        return;
      }
    }

    setCarregando(true);

    try {
      if (modo === "cadastro") {
        await authService.cadastrar(
          nome.trim(),
          email.trim(),
          senha
        );

        setModo("login");
        setSenha("");
        setConfirmarSenha("");
        setMostrarSenha(false);
        setMostrarConfirmacao(false);

        setSucesso(
          "Cadastro realizado com sucesso. " +
          "Faça login para continuar."
        );

        return;
      }

      await authService.entrar(
        email.trim(),
        senha
      );

      navigate("/", { replace: true });
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setCarregando(false);
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
            {modo === "login"
              ? "Acesse sua conta"
              : "Crie sua conta"}
          </h1>

          <p>
            {modo === "login"
              ? "Entre para acessar seu perfil de estudante."
              : "Cadastre-se gratuitamente para estudar."}
          </p>
        </div>

        <div
          className="autenticacao-abas"
          role="group"
          aria-label="Tipo de acesso"
        >
          <button
            type="button"
            className={modo === "login" ? "ativa" : ""}
            onClick={() => alternarModo("login")}
          >
            <LogIn size={17} />
            Entrar
          </button>

          <button
            type="button"
            className={modo === "cadastro" ? "ativa" : ""}
            onClick={() => alternarModo("cadastro")}
          >
            <UserPlus size={17} />
            Cadastrar
          </button>
        </div>

        <form
          className="autenticacao-formulario"
          onSubmit={(evento) => void enviar(evento)}
        >
          {modo === "cadastro" && (
            <div>
              <label htmlFor="auth-nome">
                Nome completo
              </label>

              <input
                id="auth-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                minLength={3}
                maxLength={150}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email">
              E-mail
            </label>

            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="auth-senha">
              Senha
            </label>

            <div className="autenticacao-senha-campo">
              <input
                id="auth-senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                minLength={modo === "cadastro" ? 8 : 1}
                maxLength={72}
                autoComplete={
                  modo === "login"
                    ? "current-password"
                    : "new-password"
                }
                aria-describedby={
                  modo === "cadastro"
                    ? "auth-requisitos"
                    : undefined
                }
                required
              />

              <button
                type="button"
                className="autenticacao-visibilidade"
                onClick={() =>
                  setMostrarSenha((valor) => !valor)
                }
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                aria-pressed={mostrarSenha}
                title={
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
{/* Recuperação de senha — somente no login */}
{modo === "login" && (
  <div className="autenticacao-esqueceu">
    <Link to="/recuperar-senha">
      Esqueceu sua senha?
    </Link>
  </div>
)}
          {modo === "cadastro" && (
            <>
              <div
                id="auth-requisitos"
                className="autenticacao-requisitos"
              >
                <strong>
                  A senha deve conter:
                </strong>

                {[
                  {
                    nome: "Pelo menos 8 caracteres",
                    valido: requisitos.tamanho
                  },
                  {
                    nome: "Pelo menos uma letra",
                    valido: requisitos.letra
                  },
                  {
                    nome: "Pelo menos um número",
                    valido: requisitos.numero
                  },
                  {
                    nome: "Pelo menos um caractere especial",
                    valido: requisitos.especial
                  },
                  
                ].map((item) => (
                  <div
                    key={item.nome}
                    className={
                      item.valido ? "valido" : "pendente"
                    }
                  >
                    {item.valido
                      ? <CheckCircle2 size={16} />
                      : <Circle size={16} />}

                    <span>{item.nome}</span>
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="auth-confirmar">
                  Confirmar senha
                </label>

                <div className="autenticacao-senha-campo">
                  <input
                    id="auth-confirmar"
                    type={
                      mostrarConfirmacao
                        ? "text"
                        : "password"
                    }
                    value={confirmarSenha}
                    onChange={(e) =>
                      setConfirmarSenha(e.target.value)
                    }
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="autenticacao-visibilidade"
                    onClick={() =>
                      setMostrarConfirmacao(
                        (valor) => !valor
                      )
                    }
                    aria-label={
                      mostrarConfirmacao
                        ? "Ocultar confirmação de senha"
                        : "Mostrar confirmação de senha"
                    }
                    aria-pressed={mostrarConfirmacao}
                  >
                    {mostrarConfirmacao
                      ? <EyeOff size={20} />
                      : <Eye size={20} />}
                  </button>
                </div>

                {confirmarSenha.length > 0 && (
                  <small
                    className={
                      senhasConferem
                        ? "autenticacao-confere"
                        : "autenticacao-nao-confere"
                    }
                    role="status"
                  >
                    {senhasConferem
                      ? "As senhas coincidem."
                      : "As senhas não coincidem."}
                  </small>
                )}
              </div>
            </>
          )}

          {erro && (
            <p
              className="autenticacao-erro"
              role="alert"
            >
              {erro}
            </p>
          )}

          {sucesso && (
            <p
              className="autenticacao-sucesso"
              role="status"
            >
              {sucesso}
            </p>
          )}

          <button
            className="autenticacao-enviar"
            type="submit"
            disabled={
              carregando ||
              (
                modo === "cadastro" &&
                (!senhaValida || !senhasConferem)
              )
            }
          >
            {carregando
              ? "Processando..."
              : modo === "login"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>
      </section>
    </div>
  );
}
