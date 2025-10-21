import express from "express";
import { cuentaController } from "../controllers/cuentaController.js";

const router = express.Router();

router.get("/", cuentaController.listar);
router.get("/detalle", cuentaController.listartTodo);

export default router;


