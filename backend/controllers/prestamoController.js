import { prestamoRepository } from "../repositories/prestamoRepository.js";

export const prestamoController = {
    async listar(req, res) {
        try {
            const prestamos = await prestamoRepository.listar();
            return res.status(200).json(prestamos);
        } catch (error) {
            console.error("Error en prestamoController.listar:", error);
            res.status(500).json({ message: "Error al obtener préstamos" });
        }
    },

    async getId(req, res) {
        try {
            const { id } = req.params;
            const prestamo = await prestamoRepository.getId(id);
            return res.status(200).json(prestamo);
        } catch (error) {
            console.error("Error en prestamoController.put:", error);
            
            let errores = {};
            try {
                errores = JSON.parse(error.message);
            } catch {
                errores.general = error.message;
            }
            return res.status(400).json({ errores });
        }
    },

    async crear(req, res) {
        try {
            const nuevoPrestamo = await prestamoRepository.crear(req.body);
            return res.status(201).json(nuevoPrestamo);
        } catch (error) {
            console.error("Error en prestamoController.crear:", error);
            
            if (error.message.includes("JSON")) {
                let errores = {};
                try {
                    errores = JSON.parse(error.message);
                } catch {
                    errores.general = error.message;
                }
                return res.status(400).json({ errores });
            }
            
            res.status(500).json({ message: "Error al crear el préstamo" });
        }
    },

    async put(req, res) {
        try {
            const { id } = req.params;
            const prestamoActualizado = await prestamoRepository.put(id, req.body);
            res.json(prestamoActualizado);
        } catch (error) {
            console.error("Error en prestamoController.put:", error);
            
            let errores = {};
            try {
                errores = JSON.parse(error.message);
            } catch {
                errores.general = error.message;
            }
            return res.status(400).json({ errores });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const prestamo = await prestamoRepository.delete(id);
            res.json({ 
                message: "Préstamo eliminado correctamente", 
                prestamo 
            });
        } catch (error) {
            console.error("Error en prestamoController.delete:", error);
            res.status(500).json({ message: "Error al eliminar el préstamo" });
        }
    },
};