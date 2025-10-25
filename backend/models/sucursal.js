import { z } from "zod";

export const sucursalSchema = z.object({
	idSucursal: z
		.number({
			invalid_type_error: "El ID de la sucursal debe ser un número",
		})
		.optional(), // auto-incremental en la DB
	nombre: z.string({
		required_error: "El nombre de la sucursal es obligatorio",
		invalid_type_error: "El nombre debe ser un texto",
	}),
	ciudad: z.string({
		required_error: "La ciudad es obligatoria",
		invalid_type_error: "La ciudad debe ser un texto",
	}),
	direccion: z.string({
		required_error: "La dirección es obligatoria",
		invalid_type_error: "La dirección debe ser un texto",
	}),
	telefono: z.string({
		required_error: "El teléfono es obligatorio",
		invalid_type_error: "El teléfono debe ser un texto",
	}),
	email: z
		.string({
			required_error: "El email es obligatorio",
			invalid_type_error: "El email debe ser un texto",
		})
		.email({ message: "Debe ser un email válido" }),
	estado: z
		.boolean({
			invalid_type_error: "El estado debe ser true o false",
		})
		.default(true),
});

// Para crear una sucursal nueva sin el id
export const crearSucursalSchema = sucursalSchema.omit({ idSucursal: true });

export const editarSucursalSchema = crearSucursalSchema
	.partial()
