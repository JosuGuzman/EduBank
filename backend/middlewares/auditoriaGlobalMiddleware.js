import { registrarAuditoria } from "./auditoriaMiddleware.js";

// Traduce método HTTP a verbo en español
const verboAccion = {
  POST: "Alta",
  PUT: "Modificación",
  DELETE: "Eliminación",
};

export const auditoriaGlobal = (req, res, next) => {
  res.on("finish", async () => {

    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      try {

        const partesRuta = req.originalUrl.split("/").filter(Boolean);
        const recurso = partesRuta[0] ? partesRuta[0].toLowerCase() : "recurso";
        const verbo = verboAccion[req.method] || "Acción";
        const accion = `${verbo} de ${recurso}`;


        const detalle =
          req.detalleAuditoria ||
          `Ruta: ${req.originalUrl} | Método: ${req.method} | Status: ${res.statusCode}`;

        await registrarAuditoria(req, accion, detalle);
      } catch (error) {
        console.error("⚠️ Error registrando auditoría global:", error.message);
      }
    }
  });

  next();
};
