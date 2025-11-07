import { z } from "zod";
import { usuarioSchema } from "./usuario.js";
import { tipoCuentaSchema } from "./tipoCuenta.js";
import { crearSucursalSchema, sucursalSchema } from "./sucursal.js";

export const cuentaSchema = z.object({
	IdCuenta: z
		.number({
			invalid_type_error: "El ID de la cuenta debe ser un número",
		})
		.int({ message: "El ID debe ser un número entero" })
		.positive({ message: "El ID debe ser positivo" })
		.optional(), 
	CBU: z
		.string({
			required_error: "El CBU es obligatorio",
			invalid_type_error: "El CBU debe ser un texto",
		})
		.length(22, { message: "El CBU debe tener exactamente 22 caracteres" }),
	Alias: z
		.string({
			invalid_type_error: "El alias debe ser un texto",
		})
		.max(30, { message: "El alias no puede superar 30 caracteres" })
		.optional(),
	Saldo: z.preprocess(
		(val) => {
			// si viene como string, convertir a número
			if (typeof val === "string") return parseFloat(val);
			return val;
		},
		z
			.number({
				invalid_type_error: "La tasa de interés debe ser un número",
			})
			.nonnegative({ message: "La tasa de interés no puede ser negativa" })
			.default(0)
	),
	FechaApertura: z.union([z.string().datetime(), z.date()]),
	Activa: z.union([z.boolean(), z.number().transform((n) => Boolean(n))]),
	
	usuario: usuarioSchema, // Objeto Usuario con sucursal anidada
	tipoCuenta: tipoCuentaSchema, // Objeto TipoCuenta
	sucursal: sucursalSchema, // Objeto Sucursal de la cuenta
});


// Esquema para crear una nueva cuenta (sin idCuenta)
export const crearCuentaSchema = z.object({
	IdUsuario: z.number({
		required_error: "El ID del usuario es obligatorio",
		invalid_type_error: "El ID del usuario debe ser un número",
	}),
	IdTipoCuenta: z.number({
		required_error: "El ID del tipo de cuenta es obligatorio",
		invalid_type_error: "El ID del tipo de cuenta debe ser un número",
	}),
	IdSucursal: z.number({
		required_error: "El ID de la sucursal es obligatorio",
		invalid_type_error: "El ID de la sucursal debe ser un número",
	}),
	CBU: z
		.string({
			required_error: "El CBU es obligatorio",
			invalid_type_error: "El CBU debe ser un texto",
		})
		.length(22, { message: "El CBU debe tener exactamente 22 caracteres" }),
	Alias: z
		.string({
			invalid_type_error: "El alias debe ser un texto",
		})
		.max(30, { message: "El alias no puede superar 30 caracteres" })
		.optional(),
	Saldo: z
		.number({
			invalid_type_error: "El saldo debe ser un número",
		})
		.default(0.0),
	Activa: z
		.boolean({
			invalid_type_error: "Activa debe ser true o false",
		})
		.default(true),
	FechaApertura: z.union([z.string().datetime(), z.date()])
});

export const editarCuentaSchema = crearCuentaSchema.partial();