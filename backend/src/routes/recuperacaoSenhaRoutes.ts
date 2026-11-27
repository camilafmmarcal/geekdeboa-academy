
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import {
  RecuperacaoSenhaController
} from "../controllers/recuperacaoSenhaController";

const router = Router();
const controller = new RecuperacaoSenhaController();

const limiteSolicitacao = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    erro:
      "Muitas solicitações. Tente novamente mais tarde."
  }
});

const limiteRedefinicao = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    erro:
      "Muitas tentativas. Tente novamente mais tarde."
  }
});

router.post(
  "/solicitar",
  limiteSolicitacao,
  controller.solicitar
);

router.post(
  "/redefinir",
  limiteRedefinicao,
  controller.redefinir
);

export default router;
