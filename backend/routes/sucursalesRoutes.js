import express from "express";
import { sucursalController } from "../controllers/sucursalController.js";

const router = express.Router();

router.get("/", sucursalController.listar);

export default router;


