
import { Router } from "express";
import { SimuladoController } from "../controllers/simuladoController";

const router = Router();
const controller = new SimuladoController();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);

export default router;
