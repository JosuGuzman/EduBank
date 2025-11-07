import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  // Obtener el token de las cookies o del encabezado Authorization
  const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Se requiere autenticación." });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Adjuntar la información del usuario al objeto de solicitud
    req.user = {
      id_usuario: decoded.id_usuario,
      email: decoded.email,
      nivel_acceso: decoded.nivel_acceso
    };
    
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "La sesión ha expirado. Por favor, inicia sesión nuevamente." });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Token inválido. Por favor, inicia sesión nuevamente." });
    }
    
    return res.status(401).json({ error: "Error de autenticación. Por favor, inicia sesión nuevamente." });
  }
};

// Middleware para verificar roles de usuario
// Ejemplo de uso: router.get('/ruta-protegida', verificarRol(['admin', 'editor']), (req, res) => {...})
export const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado - Usuario no autenticado" });
    }
    
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.user.nivel_acceso)) {
      return res.status(403).json({ 
        error: "Acceso denegado - No tienes los permisos necesarios" 
      });
    }
    
    next();
  };
};
