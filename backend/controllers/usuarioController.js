import { usuarioRepository } from "../repositories/usuarioRepository.js";

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
};

