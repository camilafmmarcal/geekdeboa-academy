
import { Router } from "express";
import { QuestaoController } from "../controllers/questaoController";

const router = Router();
const controller = new QuestaoController();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);

router.post("/:id/responder", controller.responder);

export default router;
