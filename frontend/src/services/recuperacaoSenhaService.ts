
import { api } from "./api";

export const recuperacaoSenhaService = {
  async solicitar(email: string) {
    const resposta = await api.post<{
      mensagem: string;
    }>("/recuperacao-senha/solicitar", {
      email
    });

    return resposta.data;
  },

  async redefinir(
    token: string,
    novaSenha: string
  ) {
    const resposta = await api.post<{
      mensagem: string;
    }>("/recuperacao-senha/redefinir", {
      token,
      novaSenha
    });

    return resposta.data;
  }
};
