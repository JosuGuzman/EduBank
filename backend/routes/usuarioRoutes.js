import { usuarioController } from "../controllers/usuarioController.js";
import express from "express";

const router = express.Router();

router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.getId);
router.put("/:id", usuarioController.put);
router.post("/", usuarioController.crear);

export default router;




