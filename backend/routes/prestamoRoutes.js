import express from "express";
import { prestamoController } from "../controllers/prestamoController.js";

const router = express.Router();

router.get("/", prestamoController.listar);
router.get("/:id", prestamoController.getId);
router.post("/", prestamoController.crear);
router.put("/:id", prestamoController.put);
router.delete("/:id", prestamoController.delete);

export default router;