import { z } from "zod";

export const transaccionSchema = z.object({
	idTransaccion: z.number().int().positive({
		message: "El id de la transacción debe ser un número entero positivo",
	}),
	idCuentaOrigen: z
		.number()
		.int()
		.positive({ message: "El id de la cuenta origen debe ser un número entero positivo" })
		.nullable(),
	idCuentaDestino: z
		.number()
		.int()
		.positive({ message: "El id de la cuenta destino debe ser un número entero positivo" })
		.nullable(),
	monto: z.coerce
		.number({ invalid_type_error: "El monto debe ser un número" })
		.positive({ message: "El monto debe ser mayor a 0" }),
	fecha: z.coerce.date({ invalid_type_error: "La fecha debe ser válida" }),
	tipo: z.enum(["deposito", "retiro", "transferencia", "pago"], {
		errorMap: () => ({ message: "Tipo de transacción inválido" }),
	}),
	descripcion: z.string().max(255, { message: "La descripción no puede superar 255 caracteres" }).nullable().optional(),
	estado: z
		.enum(["pendiente", "completado", "cancelado"], {
			errorMap: () => ({ message: "Estado inválido" }),
		})
		.default("completado"),
});

// Para crear una transacción nueva sin el id
export const transaccionCreate = transaccionSchema.omit({ idTransaccion: true });

