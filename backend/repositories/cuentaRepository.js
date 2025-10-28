import db from "../db.js";
import { cuentaSchema } from "../models/cuenta.js";

export const cuentaRepository = {
	async listar() {
		return await db("cuenta").select("*");
	},
	async listarTodo() {
		const filas = await db("Cuenta as c")
			.join("Usuario as u", "c.IdUsuario", "u.IdUsuario")
			.join("TipoCuenta as t", "c.IdTipoCuenta", "t.IdTipoCuenta")
			.join("Sucursal as s", "c.IdSucursal", "s.IdSucursal")
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
				"t.IdTipoCuenta",
				"t.Nombre as TipoCuentaNombre",
				"t.Descripcion",
				"t.PermiteCredito",
				"t.Moneda",
				"t.TasaInteres",
				"s.IdSucursal as SucursalId",
				"s.Nombre as SucursalNombre",
				"s.Ciudad as SucursalCiudad",
				"s.Direccion as SucursalDireccion",
				"s.Telefono as SucursalTelefono",
				"s.Email as SucursalEmail",
				"s.Estado as SucursalEstado"
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
					idSucursal: f.SucursalId,
					nombre: f.SucursalNombre,
					ciudad: f.SucursalCiudad,
					direccion: f.SucursalDireccion,
					telefono: f.SucursalTelefono,
					email: f.SucursalEmail,
					estado: Boolean(f.SucursalEstado),
				},
			})
		);

	},
};






