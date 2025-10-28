import express from "express";
import { tipoCuentaController } from "../controllers/tipoCuentaController.js";

const router = express.Router();

router.get("/", tipoCuentaController.listar);
router.get("/:id", tipoCuentaController.getId);
router.post("/" , tipoCuentaController.crear);
router.put("/:id", tipoCuentaController.put);
router.delete("/:id", tipoCuentaController.delete);

export default router;