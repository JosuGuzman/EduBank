import db from "../db.js";
import { cuentaSchema , crearCuentaSchema, editarCuentaSchema} from "../models/cuenta.js";
import {usuarioRepository} from "./usuarioRepository.js"
import { tipoCuentaRepository } from "./tipoCuentaRepository.js"
import { sucursalRepository } from "./sucursalRepository.js";

export const cuentaRepository = {
	async listar() {
		const cuentas = await db("Cuenta")
		.join("Sucursal", "Cuenta.IdSucursal", "Sucursal.IdSucursal")
		.join("Usuario", "Cuenta.IdUsuario", "Usuario.IdUsuario")
		.join("TipoCuenta", "Cuenta.IdTipoCuenta", "TipoCuenta.IdTipoCuenta")
		// .join("usuario", "cuenta.IdUsuario", "usuario.IdUsuario")
		// .join("tipoCuenta", "cuenta.IdTipoCuenta", "tipoCuenta.IdTipoCuenta")
		// .select("*");

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
		const cuenta = await db("Cuenta")
		.join("Sucursal", "Cuenta.IdSucursal", "Sucursal.IdSucursal")
		.join("Usuario", "Cuenta.IdUsuario", "Usuario.IdUsuario")
		.join("TipoCuenta", "Cuenta.IdTipoCuenta", "TipoCuenta.IdTipoCuenta")
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

		const [IdCuenta] = await db("Cuenta").insert(CuentaAcrear);
		
		const cuentaShow = await db("Cuenta").where({ IdCuenta }).first();
		
		return cuentaShow;
	},
	async put(id, datos) {
		const resultado = editarCuentaSchema.safeParse(datos);
		if (!resultado.success) {
			throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
		}

		const { data } = resultado;

		// 🔹 Evitar update vacío
		if (!data || Object.keys(data).length === 0) {
			throw new Error("No se proporcionaron campos para actualizar");
		}

		// 🔹 Formatear fecha si viene incluida
		if (data.FechaApertura) {
			if (data.FechaApertura instanceof Date) {
				data.FechaApertura = data.FechaApertura
					.toISOString()
					.slice(0, 19)
					.replace('T', ' ');
			} else if (typeof data.FechaApertura === "string" && data.FechaApertura.includes("T")) {
				data.FechaApertura = data.FechaApertura.slice(0, 19).replace('T', ' ');
			}
		}

		await db("Cuenta").where({ idCuenta: id }).update(data);

		const cuentaActualizada = this.getId(id);
		return cuentaActualizada;
	},
	async delete(id) {
		const cuentaAeliminar = await db("Cuenta")
			.where({ idCuenta: Number(id) })
			.first();

		if (!cuentaAeliminar) {
			throw new Error("No se encontró la cuenta");
		}

		await db("Cuenta").where({ idCuenta: Number(id) }).delete();

		return { ...cuentaAeliminar }; // devuelve objeto plano
	}
};