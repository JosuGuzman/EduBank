import jwt from "jsonwebtoken";
import { auditoriaRepository } from "../repositories/auditoriaRepository.js";

export const registrarAuditoria = async (req, accion, detalle = null) => {
  try {
    const token = req.cookies?.access_token; 
    if (!token) {
      console.warn("No se encontró token en la cookie para auditoría.");
      return;
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const idUsuario = decoded.id_usuario; 

  const ip = (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "desconocida"
  ).replace(/^::ffff:/, "");


    await auditoriaRepository.crear({
      IdUsuario: idUsuario,
      Accion: accion,
      Detalle: detalle,
      IP: ip,
    });
  } catch (error) {
    console.error("Error al registrar auditoría:", error.message);
  }
};
