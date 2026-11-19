
import { Router } from "express";
import { DisciplinaController } from "../controllers/disciplinaController";

const router = Router();
const controller = new DisciplinaController();

router.get("/", controller.listar);
router.get("/:id/assuntos", controller.listarAssuntos);

export default router;
