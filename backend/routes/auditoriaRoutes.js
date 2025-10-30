import express from "express";
import { auditoriaController } from "../controllers/auditoriaController.js";

const router = express.Router();

router.get("/", auditoriaController.listar);
router.get("/:id", auditoriaController.getId);
router.post("/", auditoriaController.crear);
router.get("/usuario/:idUsuario", auditoriaController.listarPorUsuario);
router.get("/fecha/rango", auditoriaController.listarPorFecha);

export default router;