import { sucursalRepositorie } from "../repositories/sucursalRepositorie.js";

export const sucursalController = {
    async listar(req,res){
        try {
            const sucursales = await sucursalRepositorie.listar();
            if (sucursales.length === 0) {
                return res.status(404).json({ message: "No se encontraron sucursales" });
            }
            res.json(sucursales);
        } catch (error) {
            console.error("Error en sucursalController.listar:", error);
            res.status(500).json({ message: "Error al obtener sucursales" });
        }
    }
}