import { auditoriaRepository } from "../repositories/auditoriaRepository.js";

export const auditoriaController = {
    async listar(req, res) {
        try {
            const auditorias = await auditoriaRepository.listar();
            res.json(auditorias);
        } catch (error) {
            console.error("Error en auditoriaController.listar:", error);
            res.status(500).json({ message: "Error al obtener registros de auditoría" });
        }
    },

    async getId(req, res) {
        try {
            const { id } = req.params;
            const auditoria = await auditoriaRepository.getId(id);
            res.json(auditoria);
        } catch (error) {
            console.error("Error en auditoriaController.getId:", error);
            res.status(500).json({ message: "Error al obtener el registro de auditoría" });
        }
    },

    async crear(req, res) {
        try {
            const nuevaAuditoria = await auditoriaRepository.crear(req.body);
            res.status(201).json(nuevaAuditoria);
        } catch (error) {
            console.error("Error en auditoriaController.crear:", error);
            
            if (error.message.includes("JSON")) {
                let errores = {};
                try {
                    errores = JSON.parse(error.message);
                } catch {
                    errores.general = error.message;
                }
                return res.status(400).json({ errores });
            }
            
            res.status(500).json({ message: "Error al crear el registro de auditoría" });
        }
    },

    async listarPorUsuario(req, res) {
        try {
            const { idUsuario } = req.params;
            const auditorias = await auditoriaRepository.listarPorUsuario(idUsuario);
            res.json(auditorias);
        } catch (error) {
            console.error("Error en auditoriaController.listarPorUsuario:", error);
            res.status(500).json({ message: "Error al obtener auditorías del usuario" });
        }
    },

    async listarPorFecha(req, res) {
        try {
            const { inicio, fin } = req.query;
            
            if (!inicio || !fin) {
                return res.status(400).json({ 
                    message: "Se requieren parámetros 'inicio' y 'fin' en formato YYYY-MM-DD" 
                });
            }

            const auditorias = await auditoriaRepository.listarPorFecha(inicio, fin);
            res.json(auditorias);
        } catch (error) {
            console.error("Error en auditoriaController.listarPorFecha:", error);
            res.status(500).json({ message: "Error al obtener auditorías por fecha" });
        }
    }
};