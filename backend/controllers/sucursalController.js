import { sucursalRepository } from "../repositories/sucursalRepository.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";

export const sucursalController = {
    async listar(req,res){
        try {
            const sucursales = await sucursalRepository.listar();
            if (sucursales.length === 0) {
                return res.status(404).json({ message: "No se encontraron sucursales" });
            }
            res.json(sucursales);
        } catch (error) {
            console.error("Error en sucursalController.listar:", error);
            res.status(500).json({ message: "Error al obtener sucursales" });
        }
    },
    async getId(req,res){
        try{
            const {id} = req.params;
            const sucursal = await sucursalRepository.getId(id);
            res.json(sucursal);
        }
        catch{
            console.error("Error en sucursalController.getId:", error);
            res.status(500).json({ message: "Error al obtener la sucursal" });
        }
    }, 
    async crear(req,res){
        try{
            const nuevaSucursal = await sucursalRepository.crear(req.body);
            res.status(201).json(nuevaSucursal);
        }
        catch(error){
            console.error("Error en sucursalController.crear:", error);
            res.status(500).json({ message: "Error al crear la sucursal" });
        }
    },
    async put(req, res) {
        try {
			const { id } = req.params;
			const nuevaSucursal = await sucursalRepository.put(id, req.body);
			res.json(nuevaSucursal);
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
    async delete(req,res){
        try{
            const {id} = req.params;
            const sucursal = await sucursalRepository.delete(id);
            res.json({message: "eliminado correctamente",sucursal});
        }
        catch(error){
            console.error("Error en sucursalController.delete:", error);
            res.status(500).json({ message: "Error al eliminar la sucursal" });
        }
    }
}

