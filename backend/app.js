import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cuentaRoutes from "./routes/cuentaRoutes.js";
import sucursalRoutes from "./routes/sucursalesRoutes.js";
import tipoCuentaRoutes from "./routes/tipoCuentaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import transaccionRoutes from "./routes/transaccionRoutes.js";
import tarjetaRoutes from "./routes/tarjetaRoutes.js";
import prestamoRoutes from "./routes/prestamoRoutes.js";
import auditoriaRoutes from "./routes/auditoriaRoutes.js";
import cookieParser from "cookie-parser";
import { auditoriaGlobal } from "./middlewares/auditoriaGlobalMiddleware.js";


dotenv.config();
const app = express();

// Middlewares globales
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));
app.use(auditoriaGlobal);

// Rutas
app.use("/cuentas", cuentaRoutes);
app.use("/sucursales", sucursalRoutes);
app.use("/tiposCuentas", tipoCuentaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/transacciones", transaccionRoutes);
app.use("/tarjetas", tarjetaRoutes);
app.use("/prestamos", prestamoRoutes);
app.use("/auditorias", auditoriaRoutes);

app.get("/", (req, res) => {
    res.send("Servidor bancario activo ✅");
});

// Servidor Corriendo
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));