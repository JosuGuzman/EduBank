import { cuentaModel } from "../models/cuentaModel.js";

export const cuentaController = {
	async listar(req, res) {
		try {
			const cuentas = await cuentaModel.listar();
			if (cuentas.length === 0) {
				return res.status(404).json({ message: "No se encontraron cuentas" });
			}
			res.json(cuentas);
		} catch (error) {
			console.error("Error en cuentaController.listar:", error);
			res.status(500).json({ message: "Error al obtener cuentas" });
		}
	},
};


