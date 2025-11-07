import { transaccionRepository } from "../repositories/transaccionRepository.js";

export const transaccionController = {
    async listar(req, res) {
        try {
            const transacciones = await transaccionRepository.listar();
            if (transacciones.length === 0) {
                return res.status(404).json({ message: "No se encontraron transacciones" });
            }
            res.json(transacciones);
        } catch (error) {
            console.error("Error en transaccionController.listar:", error);
            res.status(500).json({ message: "Error al obtener transacciones" });
        }
    },

    async getId(req, res) {
        try {
            const { id } = req.params;
            const transaccion = await transaccionRepository.getId(id);
            res.json(transaccion);
        } catch (error) {
            console.error("Error en transaccionController.getId:", error);
            res.status(500).json({ message: "Error al obtener la transacción" });
        }
    },

    async crear(req, res) {
        try {
            const nuevaTransaccion = await transaccionRepository.crear(req.body);
            res.status(201).json(nuevaTransaccion);
        } catch (error) {
            console.error("Error en transaccionController.crear:", error);
            
            if (error.message.includes("JSON")) {
                let errores = {};
                try {
                    errores = JSON.parse(error.message);
                } catch {
                    errores.general = error.message;
                }
                return res.status(400).json({ errores });
            }
            
            res.status(500).json({ message: "Error al crear la transacción" });
        }
    },

    async put(req, res) {
    try {
        const { id } = req.params;
        const transaccionActualizada = await transaccionRepository.put(id, req.body);
        res.json(transaccionActualizada);
    } catch (error) {
        console.error("Error en transaccionController.put:", error);

        let errores = {};

        try {
        errores = JSON.parse(error.message);
        return res.status(400).json({ errores });
        } catch {
        const mensaje = error.message || "Error desconocido";

        if (mensaje.includes("No se puede modificar el tipo") || mensaje.includes("cuentas de una transacción")) {
            return res.status(400).json({ error: mensaje });
        }

        if (mensaje.includes("no existe")) {
            return res.status(404).json({ error: mensaje });
        }

        return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    },


    async delete(req, res) {
        try {
            const { id } = req.params;
            const transaccion = await transaccionRepository.delete(id);
            res.json({ 
                message: "Transacción eliminada correctamente", 
                transaccion 
            });
        } catch (error) {
            console.error("Error en transaccionController.delete:", error);
            res.status(500).json({ message: "Error al eliminar la transacción" });
        }
    }
};