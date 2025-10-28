import { z } from "zod";
import { usuarioSchema } from "./usuario.js";

export const prestamoSchema = z.object({
	idPrestamo: z
		.number({
			invalid_type_error: "El ID del préstamo debe ser un número",
		})
		.optional(), // auto-incremental en la DB
	monto: z
		.number({
			required_error: "El monto es obligatorio",
			invalid_type_error: "El monto debe ser un número",
		})
		.positive({ message: "El monto debe ser positivo" }),
	tasaInteres: z
		.number({
			required_error: "La tasa de interés es obligatoria",
			invalid_type_error: "La tasa de interés debe ser un número",
		})
		.min(0, { message: "La tasa de interés no puede ser negativa" })
		.max(100, { message: "La tasa de interés no puede superar 100%" }),
	plazoMeses: z
		.number({
			required_error: "El plazo en meses es obligatorio",
			invalid_type_error: "El plazo debe ser un número entero",
		})
		.int({ message: "El plazo debe ser un número entero" })
		.positive({ message: "El plazo debe ser positivo" }),
	fechaInicio: z.coerce.date({
		invalid_type_error: "La fecha de inicio debe ser una fecha válida",
	}),
	fechaFin: z.coerce
		.date({
			invalid_type_error: "La fecha de fin debe ser una fecha válida",
		})
		.nullable(),
	estado: z
		.enum(["pendiente", "aprobado", "rechazado", "cancelado", "pagado"], {
			errorMap: () => ({ message: "Estado de préstamo inválido" }),
		})
		.default("pendiente"),
	cuotaMensual: z
		.number({
			invalid_type_error: "La cuota mensual debe ser un número",
		})
		.nullable(),
	usuario: usuarioSchema.optional(), // Relación con el usuario
});

export const crearPrestamo = prestamoSchema.omit({ idPrestamo: true });