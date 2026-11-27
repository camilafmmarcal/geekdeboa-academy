
import { Request, Response } from "express";
import { z } from "zod";

import {
  RecuperacaoSenhaService,
  validarNovaSenha
} from "../services/recuperacaoSenhaService";

const service = new RecuperacaoSenhaService();

const solicitarSchema = z.object({
  email: z.email().max(255)
}).strict();

const redefinirSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/),
  novaSenha: z.string()
}).strict();

export class RecuperacaoSenhaController {
  solicitar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validacao = solicitarSchema.safeParse(req.body);

    if (!validacao.success) {
      res.status(400).json({
        erro: "Informe um e-mail válido."
      });
      return;
    }

    try {
      await service.solicitar(
        validacao.data.email
      );
    } catch (error) {
      // Não expor detalhes SMTP ou existência da conta.
      console.error(
        "Falha no processamento de recuperação:",
        error
      );
    }

    // Mesma resposta para contas existentes e inexistentes.
    res.status(200).json({
      mensagem:
        "Se o e-mail estiver cadastrado, você receberá " +
        "instruções para redefinir sua senha."
    });
  };

  redefinir = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validacao = redefinirSchema.safeParse(req.body);

    if (
      !validacao.success ||
      !validarNovaSenha(validacao.data.novaSenha)
    ) {
      res.status(400).json({
        erro:
          "Token ou senha inválidos. Utilize uma senha " +
          "com pelo menos 8 caracteres, incluindo letras, " +
          "números e caracteres especiais."
      });
      return;
    }

    try {
      const atualizado = await service.redefinir(
        validacao.data.token,
        validacao.data.novaSenha
      );

      if (!atualizado) {
        res.status(400).json({
          erro:
            "Link inválido, expirado ou já utilizado. " +
            "Solicite uma nova recuperação."
        });
        return;
      }

      res.status(200).json({
        mensagem: "Senha redefinida com sucesso."
      });
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);

      res.status(500).json({
        erro:
          "Não foi possível redefinir a senha."
      });
    }
  };
}
