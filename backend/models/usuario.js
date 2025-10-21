import { z } from "zod";
import { sucursalSchema } from "./sucursal.js";

export const usuarioSchema = z.object({
	nombre: z.string(),
	dni: z.string().min(7).max(8),
	email: z.email(),
	telefono: z.string().optional(),
	direccion: z.string().optional(),
	rol: z.enum(["cliente", "empleado", "gerente", "admin"]).default("cliente"),
	fechaAlta: z.string().datetime(),
	activo: z.boolean().default(true),
	sucursal: sucursalSchema.optional(),
});

export const Usuario = usuarioSchema;

export const crearUsuarioSchema = usuarioSchema.omit({ idUsuario: true });

