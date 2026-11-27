
import {
  randomBytes,
  createHash
} from "node:crypto";

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import {
  ResultSetHeader,
  RowDataPacket
} from "mysql2";

import { pool } from "../config/database";

interface UsuarioRecuperacao extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  ativo: number;
}

interface TokenRecuperacao extends RowDataPacket {
  id: number;
  usuario_id: number;
}

export function validarNovaSenha(
  senha: string
): boolean {
  return (
    senha.length >= 8 &&
    senha.length <= 72 &&
    Buffer.byteLength(senha, "utf8") <= 72 &&
    /[A-Za-z]/.test(senha) &&
    /[0-9]/.test(senha) &&
    /[^A-Za-z0-9\s]/.test(senha)
  );
}

function hashToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function criarTransportador() {
  const host = process.env.SMTP_HOST;
  const porta = Number(process.env.SMTP_PORT || 587);
  const usuario = process.env.SMTP_USER;
  const senha = process.env.SMTP_PASSWORD;

  if (
    !host ||
    !usuario ||
    !senha ||
    !Number.isInteger(porta) ||
    porta < 1 ||
    porta > 65535
  ) {
    throw new Error("SMTP não configurado.");
  }

  return nodemailer.createTransport({
    host,
    port: porta,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: usuario,
      pass: senha
    }
  });
}

export class RecuperacaoSenhaService {
  async solicitar(email: string): Promise<void> {
    const emailNormalizado =
      email.trim().toLowerCase();

    const [usuarios] =
      await pool.execute<UsuarioRecuperacao[]>(
        `SELECT id, nome, email, ativo
         FROM usuarios
         WHERE email = ?
         LIMIT 1`,
        [emailNormalizado]
      );

    const usuario = usuarios[0];

    // Não revela se o e-mail está cadastrado.
    if (!usuario || !usuario.ativo) {
      return;
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    // Invalida solicitações anteriores desse usuário.
    await pool.execute(
      `DELETE FROM recuperacao_senha
       WHERE usuario_id = ?`,
      [usuario.id]
    );

    await pool.execute<ResultSetHeader>(
      `INSERT INTO recuperacao_senha
         (usuario_id, token_hash, expira_em)
       VALUES (
         ?, ?,
         DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE)
       )`,
      [usuario.id, tokenHash]
    );

    const origem = process.env.FRONTEND_URL;

    if (!origem) {
      await this.removerToken(tokenHash);
      throw new Error("FRONTEND_URL não configurada.");
    }

    const link = new URL(
      "/redefinir-senha",
      origem
    );

    link.searchParams.set("token", token);

    try {
      await criarTransportador().sendMail({
        from: process.env.SMTP_FROM ||
          process.env.SMTP_USER,
        to: usuario.email,
        subject:
          "Geek de Boa Academy — Recuperação de senha",
        text: [
          "Recebemos uma solicitação para redefinir sua senha.",
          "",
          "Acesse o endereço abaixo:",
          link.toString(),
          "",
          "O link é válido por 30 minutos e pode ser usado uma única vez.",
          "Se você não solicitou essa alteração, ignore esta mensagem."
        ].join("\n")
      });
    } catch (error) {
      await this.removerToken(tokenHash);
      throw error;
    }
  }

  private async removerToken(
    tokenHash: string
  ): Promise<void> {
    await pool.execute(
      `DELETE FROM recuperacao_senha
       WHERE token_hash = ?`,
      [tokenHash]
    );
  }

  async redefinir(
    token: string,
    novaSenha: string
  ): Promise<boolean> {
    if (
      !/^[a-f0-9]{64}$/.test(token) ||
      !validarNovaSenha(novaSenha)
    ) {
      return false;
    }

    const tokenHash = hashToken(token);

    // Hash calculado antes de abrir a transação.
    const senhaHash = await bcrypt.hash(
      novaSenha,
      12
    );

    const conexao = await pool.getConnection();

    try {
      await conexao.beginTransaction();

      const [registros] =
        await conexao.execute<TokenRecuperacao[]>(
          `SELECT rs.id, rs.usuario_id
           FROM recuperacao_senha rs
           JOIN usuarios u
             ON u.id = rs.usuario_id
           WHERE rs.token_hash = ?
             AND rs.expira_em > UTC_TIMESTAMP()
             AND u.ativo = TRUE
           FOR UPDATE`,
          [tokenHash]
        );

      const registro = registros[0];

      if (!registro) {
        await conexao.rollback();
        return false;
      }

      const [atualizacao] =
        await conexao.execute<ResultSetHeader>(
          `UPDATE usuarios
           SET senha_hash = ?
           WHERE id = ?
             AND ativo = TRUE`,
          [senhaHash, registro.usuario_id]
        );

      if (atualizacao.affectedRows !== 1) {
        await conexao.rollback();
        return false;
      }

      // Invalida todos os links pendentes da conta.
      await conexao.execute(
        `DELETE FROM recuperacao_senha
         WHERE usuario_id = ?`,
        [registro.usuario_id]
      );

      await conexao.commit();
      return true;
    } catch (error) {
      await conexao.rollback();
      throw error;
    } finally {
      conexao.release();
    }
  }
}
