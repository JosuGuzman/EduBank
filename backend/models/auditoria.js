import { z } from "zod";
import { usuarioSchema } from "./usuario.js";

export const auditoriaSchema = z.object({
	idAuditoria: z
		.number({
			invalid_type_error: "El ID de auditoría debe ser un número",
		})
		.int({ message: "El ID debe ser un número entero" })
		.positive({ message: "El ID debe ser positivo" })
		.optional(), // auto-incremental en la DB
	usuario: usuarioSchema.optional(), // Puede ser NULL si la acción fue del sistema
	accion: z
		.string({
			required_error: "La acción es obligatoria",
			invalid_type_error: "La acción debe ser un texto",
		})
		.max(100, { message: "La acción no puede superar 100 caracteres" }),
	fecha: z.coerce
		.date({
			invalid_type_error: "La fecha debe ser válida",
		})
		.default(() => new Date()),
	detalle: z
		.string({
			invalid_type_error: "El detalle debe ser un texto",
		})
		.max(500, { message: "El detalle no puede superar 500 caracteres" })
		.optional()
		.nullable(),
	ip: z
		.string({
			invalid_type_error: "La IP debe ser un texto",
		})
		.max(50, { message: "La IP no puede superar 50 caracteres" })
		.optional()
		.nullable(),
});

export const crearAuditoria = auditoriaSchema.omit({
	idAuditoria: true,
});

