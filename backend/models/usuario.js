import { z } from "zod";
import { sucursalSchema } from "./sucursal.js";

export const usuarioSchema = z.object({
	idUsuario: z
		.number({
			invalid_type_error: "El ID del usuario debe ser un numero",
		})
		.optional(), 
	nombre: z.string({
		required_error: "El nombre es obligatorio",
		invalid_type_error: "El nombre debe ser un texto",
	}),
	dni: z
		.string({
			required_error: "El DNI es obligatorio",
			invalid_type_error: "El DNI debe ser un texto",
		})
		.min(7, { message: "El DNI debe tener al menos 7 caracteres" })
		.max(8, { message: "El DNI no puede superar 8 caracteres" }),
	email: z
		.string({
			required_error: "El email es obligatorio",
			invalid_type_error: "El email debe ser válido",
		})
		.email({ message: "Debe ser un email valido" }),
	telefono: z
		.string({
			invalid_type_error: "El telefono debe ser un texto",
		})
		.optional(),
	direccion: z
		.string({
			invalid_type_error: "La direccion debe ser un texto",
		})
		.optional(),
	rol: z
		.enum(["cliente", "empleado", "gerente", "admin"], {
			errorMap: () => ({ message: "Rol invalido" }),
		})
		.default("cliente"),
	fechaAlta: z
		.string({
			required_error: "La fecha de alta es obligatoria",
			invalid_type_error: "La fecha de alta debe ser un string con formato ISO",
		})
		.datetime({ message: "La fecha de alta debe estar en formato ISO" }),
	activo: z
		.boolean({
			invalid_type_error: "Activo debe ser true o false",
		})
		.default(true),
	sucursal: sucursalSchema.optional(),
});

// Para crear un usuario sin el id
export const crearUsuarioSchema = usuarioSchema.omit({ idUsuario: true });

