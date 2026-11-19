
import { Router } from "express";
import { DisciplinaController } from "../controllers/disciplinaController";

const router = Router();
const controller = new DisciplinaController();

router.get("/", controller.listar);

export default router;
