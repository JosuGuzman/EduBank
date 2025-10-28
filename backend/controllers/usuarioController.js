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
    crear: async(req,res) => {
        try{
            const nuevoUsuario = await usuarioRepository.crear(req.body);
            res.status(201).json(nuevoUsuario);
        }
        catch(error){
            res.status(500).json({ error: error.message });
        }
    },
    put: async(req,res) =>{
        try{
            const id = req.params.id;
            const usuario = await usuarioRepository.put(id,req.body);
            res.json(usuario);
        }
        catch(error){
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
    delete: async(req,res) => {
        try{
            const id = req.params.id;
            const usuario = await usuarioRepository.delete(id);
            res.json({message: "eliminado correctamente", usuario});
        }
        catch(error){
            res.status(500).json({ error: error.message });
        }
    }
};