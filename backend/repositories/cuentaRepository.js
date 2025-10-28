import db from "../db.js";
import { cuentaSchema } from "../models/cuenta.js";
import {usuarioRepository} from "./usuarioRepository.js"
import { tipoCuentaRepository } from "./tipoCuentaRepository.js"
import { sucursalRepository } from "./sucursalRepository.js";

export const cuentaRepository = {
	async listar() {
		const cuentas = await db("cuenta")
		.join("sucursal", "cuenta.IdSucursal", "sucursal.IdSucursal")
		.join("usuario", "cuenta.IdUsuario", "usuario.IdUsuario")
		.join("tipoCuenta", "cuenta.IdTipoCuenta", "tipoCuenta.IdTipoCuenta")
		.select("*");

		const showCuentas = await Promise.all(
			cuentas.map(async(cuenta) =>{
				const usuario = await usuarioRepository.getId(cuenta.IdUsuario);
				const sucursal = await sucursalRepository.getId(cuenta.IdSucursal);
				const tipoCuenta = await tipoCuentaRepository.getId(cuenta.IdTipoCuenta);

				const cuentaCompleta ={
					...cuenta,
					usuario,
					sucursal,
					tipoCuenta
				}

				return cuentaSchema.parse(cuentaCompleta);
			})
		)
		return showCuentas;

	}
};