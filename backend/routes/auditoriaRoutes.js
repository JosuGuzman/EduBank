import { auditoriaController } from "../controllers/auditoriaController.js";
import express from "express";

const router = express.Router();

router.get("/", auditoriaController.listar);
router.get("/:id", auditoriaController.getId);
router.put("/:id", auditoriaController.put);
router.post("/", auditoriaController.crear);
router.delete("/:id", auditoriaController.delete);


export default router;