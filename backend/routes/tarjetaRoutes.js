import express from "express";
import { tarjetaController } from "../controllers/tarjetaController.js";

const router = express.Router();

router.get("/", tarjetaController.listar);
router.get("/:id", tarjetaController.getId);
router.post("/", tarjetaController.crear);
router.put("/:id", tarjetaController.put);
router.delete("/:id", tarjetaController.delete);
router.get("/cuenta/:idCuenta", tarjetaController.listarPorCuenta);

export default router;