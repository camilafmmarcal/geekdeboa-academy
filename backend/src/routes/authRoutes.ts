
import { Router } from "express";

import {
  AuthController
} from "../controllers/authController";

import {
  autenticar
} from "../middlewares/autenticacao";

const router = Router();
const controller = new AuthController();

router.post("/cadastro", controller.cadastrar);
router.post("/login", controller.entrar);
router.get("/me", autenticar, controller.perfil);

export default router;