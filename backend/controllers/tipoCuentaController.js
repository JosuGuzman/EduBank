import { tipoCuentaRepositorie } from "../repositories/tipoCuentaRepositorie.js";

export const tipoCuentaController = {
	async listar(req, res) {
		try {
			const cuentas = await tipoCuentaRepositorie.listar();
			if (cuentas.length === 0) {
				return res.status(404).json({ message: "No se encontraron cuentas" });
			}
			res.json(cuentas);
		} catch (error) {
			console.error("Error en tipoCuentaRepositorie.listar:", error);
			res.status(500).json({ message: "Error al obtener cuentas" });
		}
	},
	async getId(req,res){
		try{
			const {id} = req.params;
			const tipoCuenta = await tipoCuentaRepositorie.getId(id);
			res.json(tipoCuenta);
		}
		catch(error){
			console.error("Error en tipoCuentaController.getId:", error);
			res.status(500).json({ message: "Error al obtener la cuenta" });
		}
	},
	async crear(req, res) {
		try {
			const nuevaCuenta = await tipoCuentaRepositorie.crear(req.body);
			res.status(201).json(nuevaCuenta);
		} catch (error) {
			console.error("Error en tipoCuentaController.crear:", error);
			res.status(500).json({ message: "Error al crear la cuenta" });
		}
	},
	async put(req, res) {
		try {
			const { id } = req.params;
			const nuevaCuenta = await tipoCuentaRepositorie.put(id, req.body);
			res.json(nuevaCuenta);
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
	async delete(req, res) {
		try {
			const { id } = req.params;
			const cuenta = await tipoCuentaRepositorie.delete(id);
			res.json({ message: "eliminado correctamente", cuenta });
		} catch (error) {
			console.error("Error en tipoCuentaController.delete:", error);
			res.status(500).json({ message: "Error al eliminar la cuenta" });
		}
	}
};



