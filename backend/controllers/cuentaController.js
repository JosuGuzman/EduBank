import { body } from "express-validator";
import { cuentaRepository } from "../repositories/cuentaRepository.js";

export const cuentaController = {
	async listar(req, res) {
		try {
			const cuentas = await cuentaRepository.listar();
			if (cuentas.length === 0) {
				return res.status(404).json({ message: "No se encontraron cuentas" });
			}
			res.json(cuentas);
		} catch (error) {
			console.error("Error en cuentaController.listar:", error);
			res.status(500).json({ message: "Error al obtener cuentas" });
		}
	},
	async getId(req,res){
		try {
			const {id} = req.params
			const cuenta = await cuentaRepository.getId(id);
			if (!cuenta) {
				return res.status(404).json({ message: "No se encontraro la cuenta" });
			}
			res.json(cuenta);
		} catch (error) {
			console.error("Error en cuentaController.getid:", error);
			res.status(500).json({ message: "Error al obtener cuenta" });
		}
	},
	async crear(req,res){
		try{
			const datos = req.body;
			const cuenta = await cuentaRepository.crear(datos)
			return res.status(201).json(cuenta)
		}
		catch(error){
			console.error("Error en cuentaController.crear:", error);
			res.status(500).json({ message: "Error al crear cuenta" });
		}
	},
	async put(req, res) {
		try {
			const id = req.params.id;
			const datos = req.body;

			console.log("Datos recibidos en PUT:", datos); // 🔍 Debug

			const cuenta = await cuentaRepository.put(id, datos);
			return res.status(200).json(cuenta);
		} catch (error) {
			console.error("Error en cuentaController.put:", error);
			res.status(500).json({ message: "Error al actualizar cuenta" });
		}
	},
	async delete(req, res) {
		try {
			const { id } = req.params;
			const cuenta = await cuentaRepository.delete(id);
			return res.status(200).json({
				message: "Se eliminó correctamente",
				cuenta
			});
		} catch (error) {
			console.error("Error en cuentaController.delete:", error);
			res.status(500).json({ message: "Error al eliminar cuenta" });
		}
	}
};