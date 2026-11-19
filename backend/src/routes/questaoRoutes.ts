
import { Router } from "express";
import { QuestaoController } from "../controllers/questaoController";

const router = Router();
const controller = new QuestaoController();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);

export default router;
