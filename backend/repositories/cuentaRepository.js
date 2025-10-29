import db from "../db.js";
import { cuentaSchema , crearCuentaSchema} from "../models/cuenta.js";
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

	},
	async getId(id){
		const cuenta = await db("cuenta")
		.join("sucursal", "cuenta.IdSucursal", "sucursal.IdSucursal")
		.join("usuario", "cuenta.IdUsuario", "usuario.IdUsuario")
		.join("tipoCuenta", "cuenta.IdTipoCuenta", "tipoCuenta.IdTipoCuenta")
		.where({idCuenta: id})
		.first()
		if(!cuenta){
			throw new Error("No se pudo encontrar la cuenta")
		}

		const usuario = await usuarioRepository.getId(cuenta.IdUsuario);
		const tipoCuenta = await tipoCuentaRepository.getId(cuenta.IdTipoCuenta);
		const sucursal = await sucursalRepository.getId(cuenta.IdSucursal);

		const cuentaTotal = {
			...cuenta,
			usuario,
			tipoCuenta,
			sucursal
		}
		const showCuenta = cuentaSchema.parse(cuentaTotal);
		return showCuenta;
	},
	async crear(datos){
		const VerificadorDeDatos = crearCuentaSchema.parse(datos);

		const fechaMySQL = new Date(VerificadorDeDatos.FechaApertura).toISOString().slice(0, 19).replace("T", " ");

		const CuentaAcrear = {
			...VerificadorDeDatos,
			FechaApertura: fechaMySQL
		}

		const [IdCuenta] = await db("cuenta").insert(CuentaAcrear);
		
		const cuentaShow = await db("cuenta").where({ IdCuenta }).first();
		
		return cuentaShow;
	}
};