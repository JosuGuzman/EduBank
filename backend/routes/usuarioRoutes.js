import { usuarioController } from "../controllers/usuarioController.js";
import express from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.post("/register", usuarioController.crear);
router.post("/login", usuarioController.login);

// Rutas protegidas (requieren autenticación)
router.get("/me", verificarToken, usuarioController.getCurrentUser);
router.get("/", verificarToken, usuarioController.listar);
router.get("/:id", verificarToken, usuarioController.getId);
router.put("/:id", verificarToken, usuarioController.put);
router.delete("/:id", verificarToken, usuarioController.delete);
router.post("/logout", verificarToken, usuarioController.logout)

export default router;