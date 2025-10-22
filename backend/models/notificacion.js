import { z } from "zod";
import { usuarioSchema } from "./usuario.js";

export const notificacionSchema = z.object({
	idNotificacion: z
		.number({
			invalid_type_error: "El ID de la notificación debe ser un número",
		})
		.int({ message: "El ID debe ser un número entero" })
		.positive({ message: "El ID debe ser positivo" })
		.optional(), // auto-incremental en la DB
	usuario: usuarioSchema, // Relación con el usuario que recibe la notificación
	titulo: z
		.string({
			required_error: "El título es obligatorio",
			invalid_type_error: "El título debe ser un texto",
		})
		.max(100, { message: "El título no puede superar 100 caracteres" }),
	mensaje: z
		.string({
			required_error: "El mensaje es obligatorio",
			invalid_type_error: "El mensaje debe ser un texto",
		})
		.max(500, { message: "El mensaje no puede superar 500 caracteres" }),
	fechaEnvio: z.coerce
		.date({
			invalid_type_error: "La fecha de envío debe ser válida",
		})
		.default(() => new Date()),
	leida: z
		.boolean({
			invalid_type_error: "Leída debe ser true o false",
		})
		.default(false),
	tipo: z
		.enum(["transaccion", "prestamo", "seguridad", "general"], {
			errorMap: () => ({ message: "Tipo de notificación inválido" }),
		})
		.default("general"),
});

// Para crear una nueva notificación sin id ni usuario anidado
export const crearNotificacion = notificacionSchema.omit({
	idNotificacion: true,
	usuario: true,
});

