import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cuentaRoutes from "./routes/cuentaRoutes.js";

dotenv.config();
const app = express();

// Middlewares globales
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Rutas
app.use("/cuentas", cuentaRoutes);

app.get("/", (req, res) => {
    res.send("Servidor bancario activo ✅");
});

// Servidor Corriendo
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));


