import { z } from "zod";

export const tipoCuentaSchema = z.object({
	idTipoCuenta: z.number({
		invalid_type_error: "El ID del tipo de cuenta debe ser un número",
	}).optional(), 
	Nombre: z
		.string({
			required_error: "El nombre del tipo de cuenta es obligatorio",
			invalid_type_error: "El nombre debe ser un texto",
		})
		.min(1, { message: "El nombre debe tener al menos 1 carácter" })
		.max(50, { message: "El nombre no puede superar 50 caracteres" }),
	Descripcion: z
		.string({
			invalid_type_error: "La descripción debe ser un texto",
		})
		.max(200, { message: "La descripción no puede superar 200 caracteres" })
		.optional(),
	permiteCredito: z
		.boolean({
			invalid_type_error: "PermiteCredito debe ser true o false",
		})
		.default(false),
	moneda: z
		.string({
			invalid_type_error: "La moneda debe ser un texto",
		})
		.max(10, { message: "La moneda no puede superar 10 caracteres" })
		.default("ARS"),
	TasaInteres: z.preprocess(
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
});


// Para crear un nuevo tipo de cuenta (sin id)
export const crearTipoCuentaSchema = tipoCuentaSchema.omit({ idTipoCuenta: true });

export const editarTipoCuentaSchema = tipoCuentaSchema.partial();