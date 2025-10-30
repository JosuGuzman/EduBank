import { tarjetaRepository } from "../repositories/tarjetaRepository.js";

export const tarjetaController = {
    async listar(req, res) {
        try {
            const tarjetas = await tarjetaRepository.listar();
            res.json(tarjetas);
        } catch (error) {
            console.error("Error en tarjetaController.listar:", error);
            res.status(500).json({ message: "Error al obtener tarjetas" });
        }
    },

    async getId(req, res) {
        try {
            const { id } = req.params;
            const tarjeta = await tarjetaRepository.getId(id);
            res.json(tarjeta);
        } catch (error) {
            console.error("Error en tarjetaController.getId:", error);
            res.status(500).json({ message: "Error al obtener la tarjeta" });
        }
    },

    async crear(req, res) {
        try {
            const nuevaTarjeta = await tarjetaRepository.crear(req.body);
            res.status(201).json(nuevaTarjeta);
        } catch (error) {
            console.error("Error en tarjetaController.crear:", error);
            
            if (error.message.includes("JSON")) {
                let errores = {};
                try {
                    errores = JSON.parse(error.message);
                } catch {
                    errores.general = error.message;
                }
                return res.status(400).json({ errores });
            }
            
            res.status(500).json({ message: "Error al crear la tarjeta" });
        }
    },

    async put(req, res) {
        try {
            const { id } = req.params;
            const tarjetaActualizada = await tarjetaRepository.put(id, req.body);
            res.json(tarjetaActualizada);
        } catch (error) {
            console.error("Error en tarjetaController.put:", error);
            
            let errores = {};
            try {
                errores = JSON.parse(error.message);
            } catch {
                errores.general = error.message;
            }
            res.status(400).json({ errores });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const tarjeta = await tarjetaRepository.delete(id);
            res.json({ 
                message: "Tarjeta eliminada correctamente", 
                tarjeta 
            });
        } catch (error) {
            console.error("Error en tarjetaController.delete:", error);
            res.status(500).json({ message: "Error al eliminar la tarjeta" });
        }
    },

    async listarPorCuenta(req, res) {
        try {
            const { idCuenta } = req.params;
            const tarjetas = await tarjetaRepository.listarPorCuenta(idCuenta);
            res.json(tarjetas);
        } catch (error) {
            console.error("Error en tarjetaController.listarPorCuenta:", error);
            res.status(500).json({ message: "Error al obtener tarjetas de la cuenta" });
        }
    }
};