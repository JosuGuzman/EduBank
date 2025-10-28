import { z } from "zod";

export const sucursalSchema = z.object({
	idSucursal: z
		.number({
			invalid_type_error: "El ID de la sucursal debe ser un número",
		})
		.optional(), // auto-incremental en la DB
	Nombre: z.string({
		required_error: "El nombre de la sucursal es obligatorio",
		invalid_type_error: "El nombre debe ser un texto",
	}),
	Ciudad: z.string({
		required_error: "La ciudad es obligatoria",
		invalid_type_error: "La ciudad debe ser un texto",
	}),
	Direccion: z.string({
		required_error: "La dirección es obligatoria",
		invalid_type_error: "La dirección debe ser un texto",
	}),
	Telefono: z.string({
		required_error: "El teléfono es obligatorio",
		invalid_type_error: "El teléfono debe ser un texto",
	}),
	Email: z
		.string({
			required_error: "El email es obligatorio",
			invalid_type_error: "El email debe ser un texto",
		})
		.email({ message: "Debe ser un email válido" }),
	Estado: z.union([z.boolean(), z.number().transform((n) => Boolean(n))]),
});

// Para crear una sucursal nueva sin el id
export const crearSucursalSchema = sucursalSchema.omit({ idSucursal: true });

export const editarSucursalSchema = crearSucursalSchema
	.partial()