import db from "../db.js";
import { editarSucursalSchema, crearSucursalSchema } from "../models/sucursal.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";

export const sucursalRepository = {
	async listar() {
		return await db("sucursal").select("*");
	},
	async getId(id){
		const sucursal = await db("Sucursal").where({ idSucursal: id }).first();
		if(!sucursal){
			throw new Error("La sucursal no existe");
		}
		return sucursal
	},
	async crear(datos) {
		
		const nuevaSucursal = crearSucursalSchema.parse(datos);

		const [id] = await db("Sucursal").insert(nuevaSucursal);
		return { id, ...nuevaSucursal };
	},
	async put(id, datos) {
		const resultado = editarSucursalSchema.safeParse(datos);

		if (!resultado.success) {
			throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
		}
		const { data } = resultado;
		await db("Sucursal").where({ idSucursal: id }).update(data);

		const sucursalUpdate = await db("Sucursal").where({ idSucursal: id }).first();
		return { ...sucursalUpdate, ...data };
	},
	async delete(id){
		const sucursal = await db("Sucursal").where({ idSucursal: id }).first();

		if (!sucursal) {
			throw new Error("La sucursal no existe");
		}

		await db("Sucursal").where({ idSucursal: id }).delete();
		return sucursal;
	}
};
