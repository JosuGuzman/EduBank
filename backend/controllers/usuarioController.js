import { usuarioRepository } from "../repositories/usuarioRepository.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const usuarioController = {
  listar: async (req, res) => {
    try {
      const usuarios = await usuarioRepository.getAll();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getId: async (req, res) => {
    try {
      const id = req.params.id;
      const usuario = await usuarioRepository.getId(id);
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  crear: async (req, res) => {
    try {
      const nuevoUsuario = await usuarioRepository.crear(req.body);

      const payload = {
        id_usuario: nuevoUsuario.showUsuario.IdUsuario,
        nivel_acceso: nuevoUsuario.showUsuario.Rol,
        email: nuevoUsuario.showUsuario.Email,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60,
        })
        .status(200)
        .json({
          message: "Register exitoso",
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  put: async (req, res) => {
    try {
      const id = req.params.id;
      const usuario = await usuarioRepository.put(id, req.body);

      return res.status(200).json(usuario);
    } catch (error) {
      let errores = {};
      try {
        errores = JSON.parse(error.message); // si tu repositorie ya hace JSON.stringify de Zod
      } catch {
        errores.general = error.message;
      }
      res.status(400).json({
        errores,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const usuario = await usuarioRepository.delete(id);
      res.json({ message: "eliminado correctamente", usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      // El middleware de autenticación ya verificó el token y adjuntó el usuario a req.user
      if (!req.user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      // Obtener la información completa del usuario
      const usuario = await usuarioRepository.getId(req.user.id_usuario);
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async login(req, res) {
    try {
      const nuevoUsuario = await usuarioRepository.login(req.body);

      const payload = {
        id_usuario: nuevoUsuario.IdUsuario,
        nivel_acceso: nuevoUsuario.Rol,
        email: nuevoUsuario.Email,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60,
          path: "/"
        })
        .status(200)
        .json({
          message: "Login exitoso",
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("access_token", {
        path: "/", 
        httpOnly: true, 
        sameSite: "strict",
      });

      return res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      return res.status(500).json({ error: "Error al cerrar sesión" });
    }
  },
};