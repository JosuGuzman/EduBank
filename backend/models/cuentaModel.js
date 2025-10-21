import db from "../db.js";

export const cuentaModel = {
	async listar() {
		return await db("cuenta").select("*");
	},
};

