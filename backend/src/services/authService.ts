
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  UsuarioRepository,
  UsuarioDB
} from "../repositories/usuarioRepository";

function usuarioPublico(usuario: UsuarioDB) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil
  };
}

function gerarToken(usuario: UsuarioDB): string {
  const segredo = process.env.JWT_SECRET;

  if (!segredo || segredo.length < 32) {
    throw new Error("JWT_SECRET não configurado adequadamente.");
  }

  return jwt.sign(
    {
      perfil: usuario.perfil
    },
    segredo,
    {
      subject: String(usuario.id),
      expiresIn: 60 * 60 * 8,
      algorithm: "HS256"
    }
  );
}

export class AuthService {
  constructor(
    private readonly repository = new UsuarioRepository()
  ) {}

  async cadastrar(
    nome: string,
    email: string,
    senha: string
  ) {
    const emailNormalizado = email.trim().toLowerCase();

    const existente = await this.repository.buscarPorEmail(
      emailNormalizado
    );

    if (existente) {
      return { status: "EMAIL_EXISTENTE" as const };
    }

    const hash = await bcrypt.hash(senha, 12);

    try {
      const id = await this.repository.criar(
        nome.trim(),
        emailNormalizado,
        hash
      );

      return {
        status: "CRIADO" as const,
        usuario: {
          id,
          nome: nome.trim(),
          email: emailNormalizado,
          perfil: "ALUNO" as const
        }
      };
    } catch (error) {
      // Trata também uma disputa entre cadastros simultâneos.
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ER_DUP_ENTRY"
      ) {
        return { status: "EMAIL_EXISTENTE" as const };
      }

      throw error;
    }
  }

  async entrar(email: string, senha: string) {
    const usuario = await this.repository.buscarPorEmail(
      email.trim().toLowerCase()
    );

    if (!usuario || !usuario.ativo) {
      // Resposta genérica para não informar se a conta existe.
      return { status: "CREDENCIAIS_INVALIDAS" as const };
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaValida) {
      return { status: "CREDENCIAIS_INVALIDAS" as const };
    }

    return {
      status: "AUTENTICADO" as const,
      token: gerarToken(usuario),
      usuario: usuarioPublico(usuario)
    };
  }

  async buscarPerfil(id: number) {
    const usuario = await this.repository.buscarPorId(id);

    if (!usuario || !usuario.ativo) {
      return null;
    }

    return usuarioPublico(usuario);
  }
}