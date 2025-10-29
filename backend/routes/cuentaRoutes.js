import express from "express";
import { cuentaController } from "../controllers/cuentaController.js";

const router = express.Router();

router.get("/", cuentaController.listar);
router.get("/:id", cuentaController.getId)

export default router;