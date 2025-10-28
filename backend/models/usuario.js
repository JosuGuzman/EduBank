import { z } from "zod";
import { sucursalSchema } from "./sucursal.js";

export const usuarioSchema = z.object({
	idUsuario: z
		.number({
			invalid_type_error: "El ID del usuario debe ser un numero",
		})
		.optional(),
	Nombre: z.string({
		required_error: "El nombre es obligatorio",
		invalid_type_error: "El nombre debe ser un texto",
	}),
	DNI: z
		.string({
			required_error: "El DNI es obligatorio",
			invalid_type_error: "El DNI debe ser un texto",
		})
		.min(7, { message: "El DNI debe tener al menos 7 caracteres" })
		.max(8, { message: "El DNI no puede superar 8 caracteres" }),
	Email: z
		.string({
			required_error: "El email es obligatorio",
			invalid_type_error: "El email debe ser válido",
		})
		.email({ message: "Debe ser un email valido" }),
	Telefono: z
		.string({
			invalid_type_error: "El telefono debe ser un texto",
		})
		.optional(),
	Direccion: z
		.string({
			invalid_type_error: "La direccion debe ser un texto",
		})
		.optional(),
	Rol: z
		.enum(["cliente", "empleado", "gerente", "admin"], {
			errorMap: () => ({ message: "Rol invalido" }),
		})
		.default("cliente"),
	FechaAlta: z.union([z.string().datetime(), z.date()]),
	Activo: z.union([z.boolean(), z.number().transform((n) => Boolean(n))]),
	sucursal: sucursalSchema.optional(),
});


// Para crear un usuario sin el id
export const crearUsuarioSchema = usuarioSchema.omit({ idUsuario: true });

export const editarUsuarioSchema = crearUsuarioSchema.partial();










