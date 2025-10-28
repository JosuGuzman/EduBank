import express from "express";
import { sucursalController } from "../controllers/sucursalController.js";

const router = express.Router();

router.get("/", sucursalController.listar);
router.get("/:id", sucursalController.getId);
router.post("/" , sucursalController.crear);
router.put("/:id", sucursalController.put);
router.delete("/:id", sucursalController.delete);

export default router;