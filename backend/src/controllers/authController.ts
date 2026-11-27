
import { Request, Response } from "express";
import { z } from "zod";

import { AuthService } from "../services/authService";

import {
  RequisicaoAutenticada
} from "../middlewares/autenticacao";

const service = new AuthService();


const senhaSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .max(72, "A senha deve ter no máximo 72 caracteres.")
  .refine(
    (senha) => /[A-Za-z]/.test(senha),
    "A senha deve conter pelo menos uma letra."
  )
  .refine(
    (senha) => /[0-9]/.test(senha),
    "A senha deve conter pelo menos um número."
  )
  .refine(
    (senha) => /[^A-Za-z0-9\s]/.test(senha),
    "A senha deve conter pelo menos um caractere especial."
  )
  .refine(
    (senha) => Buffer.byteLength(senha, "utf8") <= 72,
    "A senha excede o limite de 72 bytes."
  );

const cadastroSchema = z.object({
  nome: z.string().trim().min(3).max(150),
  email: z.email().max(255),
  senha: senhaSchema
}).strict();

const loginSchema = z.object({
  email: z.email(),
  senha: z.string().min(1)
}).strict();

export class AuthController {
  cadastrar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validacao = cadastroSchema.safeParse(req.body);

    
if (!validacao.success) {
  res.status(400).json({
    erro: validacao.error.issues[0]?.message ??
      "Dados de cadastro inválidos."
  });
  return;
}

    try {
      const resultado = await service.cadastrar(
        validacao.data.nome,
        validacao.data.email,
        validacao.data.senha
      );

      if (resultado.status === "EMAIL_EXISTENTE") {
        res.status(409).json({
          erro: "Não foi possível cadastrar este e-mail."
        });
        return;
      }

      res.status(201).json({
        mensagem: "Cadastro realizado com sucesso.",
        usuario: resultado.usuario
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);

      res.status(500).json({
        erro: "Não foi possível realizar o cadastro."
      });
    }
  };

  entrar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validacao = loginSchema.safeParse(req.body);

    if (!validacao.success) {
      res.status(400).json({
        erro: "Informe e-mail e senha válidos."
      });
      return;
    }

    try {
      const resultado = await service.entrar(
        validacao.data.email,
        validacao.data.senha
      );

      if (resultado.status !== "AUTENTICADO") {
        res.status(401).json({
          erro: "E-mail ou senha inválidos."
        });
        return;
      }

      res.status(200).json({
        token: resultado.token,
        usuario: resultado.usuario
      });
    } catch (error) {
      console.error("Erro no login:", error);

      res.status(500).json({
        erro: "Não foi possível realizar o login."
      });
    }
  };

  perfil = async (
    req: RequisicaoAutenticada,
    res: Response
  ): Promise<void> => {
    try {
      const usuario = await service.buscarPerfil(
        req.usuarioId!
      );

      if (!usuario) {
        res.status(401).json({
          erro: "Usuário inativo ou inexistente."
        });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error("Erro ao consultar perfil:", error);

      res.status(500).json({
        erro: "Não foi possível consultar o perfil."
      });
    }
  };
}