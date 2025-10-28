import db from "../db.js";
import { crearTipoCuentaSchema , editarTipoCuentaSchema} from "../models/tipoCuenta.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";

export const tipoCuentaRepository = {
	async listar() {
		return await db("tipoCuenta").select("*");
	},
    async getId(id){
        const tipoCuenta = await db("tipoCuenta").where({ idTipoCuenta: id }).first();
        if(!tipoCuenta){
            throw new Error("no se encontro el tipo de cuenta");
        }

        return tipoCuenta;
    },
    async crear(datos){
        const nuevaTipoCuenta = crearTipoCuentaSchema.parse(datos);

        await db("tipoCuenta").insert(nuevaTipoCuenta);

        return { nuevaTipoCuenta};
    },
    async put(id, datos){
        const resultado = editarTipoCuentaSchema.safeParse(datos);
        if (!resultado.success) {
            throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
        }
        const { data } = resultado;
        await db("tipoCuenta").where({ idTipoCuenta: id }).update(data);
        const tipoCuentaUpdate = await db("tipoCuenta").where({ idTipoCuenta: id }).first();
        return { ...tipoCuentaUpdate};
    },
    async delete(id){
        const tipoCuenta = await db("tipoCuenta").where({ idTipoCuenta: id }).first();

        if (!tipoCuenta) {
            throw new Error("El tipo de cuenta no existe");
        }
        await db("tipoCuenta").where({ idTipoCuenta: id }).delete();
        return tipoCuenta;
    }
};