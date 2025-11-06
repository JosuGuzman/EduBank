import { usuarioController } from "../controllers/usuarioController.js";
import express from "express";

const router = express.Router();

router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.getId);
router.put("/:id", usuarioController.put);
router.post("/register", usuarioController.crear);
router.delete("/:id", usuarioController.delete);

export default router;