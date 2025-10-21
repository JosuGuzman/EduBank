import express from "express";
import { cuentaController } from "../controllers/cuentaController.js";

const router = express.Router();

router.get("/", cuentaController.listar);

export default router;

