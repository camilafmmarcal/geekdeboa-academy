
import {
  Request,
  Response,
  NextFunction
} from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

export interface RequisicaoAutenticada extends Request {
  usuarioId?: number;
}

export function autenticar(
  req: RequisicaoAutenticada,
  res: Response,
  next: NextFunction
): void {
  const cabecalho = req.headers.authorization;

  if (!cabecalho?.startsWith("Bearer ")) {
    res.status(401).json({
      erro: "Autenticação necessária."
    });
    return;
  }

  const token = cabecalho.slice(7);
  const segredo = process.env.JWT_SECRET;

  if (!segredo || segredo.length < 32) {
    res.status(500).json({
      erro: "Configuração de autenticação indisponível."
    });
    return;
  }

  try {
    const dados = jwt.verify(token, segredo, {
      algorithms: ["HS256"]
    });

    if (
      typeof dados === "string" ||
      !(dados as JwtPayload).sub
    ) {
      throw new Error("Token inválido.");
    }

    const idTexto = (dados as JwtPayload).sub;

    if (
      typeof idTexto !== "string" ||
      !/^[1-9]\d*$/.test(idTexto)
    ) {
      throw new Error("Identificador inválido.");
    }

    const id = Number(idTexto);

    if (!Number.isSafeInteger(id)) {
      throw new Error("Identificador inválido.");
    }

    req.usuarioId = id;
    next();
  } catch {
    res.status(401).json({
      erro: "Sessão inválida ou expirada."
    });
  }
}