import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const token = req.cookies?.access_token; 

  if (!token) {
    return res.status(401).json({ error: "Token no encontrado o no autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Error verificando token:", err);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
