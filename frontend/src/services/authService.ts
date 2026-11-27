
import { api } from "./api";

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  email: string;
  perfil: "ALUNO" | "ADMIN";
}

interface RespostaLogin {
  token: string;
  usuario: UsuarioAutenticado;
}

const CHAVE_TOKEN = "geekdeboa_token";
const EVENTO_AUTH = "geekdeboa-auth";

export const authService = {
  async cadastrar(
    nome: string,
    email: string,
    senha: string
  ) {
    const resposta = await api.post(
      "/auth/cadastro",
      { nome, email, senha }
    );

    return resposta.data;
  },

  async entrar(email: string, senha: string) {
    const resposta = await api.post<RespostaLogin>(
      "/auth/login",
      { email, senha }
    );

    sessionStorage.setItem(
      CHAVE_TOKEN,
      resposta.data.token
    );

    window.dispatchEvent(new Event(EVENTO_AUTH));

    return resposta.data.usuario;
  },

  sair() {
    sessionStorage.removeItem(CHAVE_TOKEN);
    window.dispatchEvent(new Event(EVENTO_AUTH));
  },

  obterToken() {
    return sessionStorage.getItem(CHAVE_TOKEN);
  },

  async perfil() {
    const token = this.obterToken();

    if (!token) {
      return null;
    }

    const resposta = await api.get<UsuarioAutenticado>(
      "/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return resposta.data;
  }
};