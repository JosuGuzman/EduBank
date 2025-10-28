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
	async listartTodo(req, res) {
		try{
			const cuentasDetalladas = await cuentaRepository.listarTodo();
			if(cuentasDetalladas.length === 0){
				return res.status(404).json({message: "No se encontraron cuentas"});
			}
			res.json(cuentasDetalladas)
		}
		catch(error){
			console.error("Error en cuentaController.listarTodo:", error);
			res.status(500).json({message: "Error al obtener cuentas"});
		}
	}
};