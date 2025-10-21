import db from "../db.js";
import { cuentaSchema } from "../models/cuenta.js";

export const cuentaRepositorie = {
	async listar() {
		return await db("cuenta").select("*");
	},
	async listarTodo() {
		const filas = await db("Cuenta as c")
			.join("Usuario as u", "c.IdUsuario", "u.IdUsuario")
			.join("TipoCuenta as t", "c.IdTipoCuenta", "t.IdTipoCuenta")
			.join("Sucursal as sC", "c.IdSucursal", "sC.IdSucursal")
			.join("Sucursal as sU", "u.IdSucursal", "sU.IdSucursal")
			.select(
				"c.IdCuenta",
				"c.CBU",
				"c.Alias",
				"c.Saldo",
				"c.FechaApertura",
				"c.Activa",
				"u.IdUsuario",
				"u.Nombre as UsuarioNombre",
				"u.DNI",
				"u.Email",
				"u.Rol",
				"u.Activo",
				"u.FechaAlta",
				"sU.IdSucursal as UsuarioSucursalId",
				"sU.Nombre as UsuarioSucursalNombre",
				"sU.Ciudad as UsuarioSucursalCiudad",
				"sU.Direccion as UsuarioSucursalDireccion",
				"sU.Telefono as UsuarioSucursalTelefono",
				"sU.Email as UsuarioSucursalEmail",
				"sU.Estado as UsuarioSucursalEstado",
				"t.IdTipoCuenta",
				"t.Nombre as TipoCuentaNombre",
				"t.Descripcion",
				"t.PermiteCredito",
				"t.Moneda",
				"t.TasaInteres",
				"sC.IdSucursal as CuentaSucursalId",
				"sC.Nombre as CuentaSucursalNombre",
				"sC.Ciudad as CuentaSucursalCiudad",
				"sC.Direccion as CuentaSucursalDireccion",
				"sC.Telefono as CuentaSucursalTelefono",
				"sC.Email as CuentaSucursalEmail",
				"sC.Estado as CuentaSucursalEstado"
			);
		return filas.map((f) =>
			cuentaSchema.parse({
				idCuenta: f.IdCuenta,
				cbu: f.CBU,
				alias: f.Alias,
				saldo: Number(f.Saldo),
				fechaApertura: new Date(f.FechaApertura).toISOString(),
				activa: Boolean(f.Activa),
				usuario: {
					idUsuario: f.IdUsuario,
					nombre: f.UsuarioNombre,
					dni: f.DNI,
					email: f.Email,
					rol: f.Rol,
					activo: Boolean(f.Activo),
					fechaAlta: new Date(f.FechaAlta).toISOString(),
					sucursal: {
						idSucursal: f.UsuarioSucursalId,
						nombre: f.UsuarioSucursalNombre,
						ciudad: f.UsuarioSucursalCiudad,
						direccion: f.UsuarioSucursalDireccion,
						telefono: f.UsuarioSucursalTelefono,
						email: f.UsuarioSucursalEmail,
						estado: Boolean(f.UsuarioSucursalEstado),
					},
				},
				tipoCuenta: {
					idTipoCuenta: f.IdTipoCuenta,
					nombre: f.TipoCuentaNombre,
					descripcion: f.Descripcion,
					permiteCredito: Boolean(f.PermiteCredito),
					moneda: f.Moneda,
					tasaInteres: Number(f.TasaInteres),
				},
				sucursal: {
					idSucursal: f.CuentaSucursalId,
					nombre: f.CuentaSucursalNombre,
					ciudad: f.CuentaSucursalCiudad,
					direccion: f.CuentaSucursalDireccion,
					telefono: f.CuentaSucursalTelefono,
					email: f.CuentaSucursalEmail,
					estado: Boolean(f.CuentaSucursalEstado),
				},
			})
		);
	},
};




