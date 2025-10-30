import express from "express";
import { transaccionController } from "../controllers/transaccionController.js";

const router = express.Router();

router.get("/", transaccionController.listar);
router.get("/:id", transaccionController.getId);
router.post("/", transaccionController.crear);
router.put("/:id", transaccionController.put);
router.delete("/:id", transaccionController.delete);

export default router;