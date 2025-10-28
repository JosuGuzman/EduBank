import { usuarioController } from "../controllers/usuarioController.js";
import express from "express";

const router = express.Router();

router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.getId);

export default router;




