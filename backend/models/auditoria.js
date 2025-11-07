import { z } from "zod";
import { usuarioSchema } from "./usuario.js";

export const auditoriaSchema = z.object({
	IdAuditoria: z
		.number({
			invalid_type_error: "El ID de auditoría debe ser un numero",
		})
		.int({ message: "El ID debe ser un numero entero" })
		.positive({ message: "El ID debe ser positivo" })
		.optional(), 
	usuario: usuarioSchema.optional(), 
	Accion: z
		.string({
			required_error: "La acción es obligatoria",
			invalid_type_error: "La acción debe ser un texto",
		})
		.max(100, { message: "La acción no puede superar 100 caracteres" }),
	Fecha: z.coerce
		.date({
			invalid_type_error: "La fecha debe ser válida",
		})
		.default(() => new Date()),
	Detalle: z
		.string({
			invalid_type_error: "El detalle debe ser un texto",
		})
		.max(500, { message: "El detalle no puede superar 500 caracteres" })
		.optional()
		.nullable(),
	IP: z
		.string({
			invalid_type_error: "La IP debe ser un texto",
		})
		.max(50, { message: "La IP no puede superar 50 caracteres" })
		.optional()
		.nullable(),
	IdUsuario: z
        .number({
            invalid_type_error: "El ID de usuario debe ser un numero",
        })
        .int({ message: "El ID debe ser un numero entero" })
        .positive({ message: "El ID debe ser positivo" })
        .optional(),
});

export const crearAuditoria = auditoriaSchema.omit({
	IdAuditoria: true,
	usuario: true
});

export const editarAuditoria = crearAuditoria.partial();