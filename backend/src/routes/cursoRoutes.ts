
import { Router } from "express";
import { CursoController } from "../controllers/cursoController";

const router = Router();
const controller = new CursoController();

router.get("/", controller.listar);

router.get("/categorias", controller.listarCategorias);

router.get("/:id", controller.buscarPorId);

export default router;
