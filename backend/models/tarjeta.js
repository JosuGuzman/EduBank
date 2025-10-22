import { z } from "zod";
import { cuentaSchema } from "./cuenta.js";

export const tarjetaSchema = z.object({
	idTarjeta: z
		.number({
			invalid_type_error: "El ID de la tarjeta debe ser un número",
		})
		.optional(), // auto-incremental en la DB
	numeroTarjeta: z
		.string({
			required_error: "El número de tarjeta es obligatorio",
			invalid_type_error: "El número de tarjeta debe ser un texto",
		})
		.length(16, { message: "El número de tarjeta debe tener 16 caracteres" }),
	fechaVencimiento: z.coerce.date({
		invalid_type_error: "La fecha de vencimiento debe ser válida",
	}),
	cvv: z
		.string({
			required_error: "El CVV es obligatorio",
			invalid_type_error: "El CVV debe ser un texto",
		})
		.length(3, { message: "El CVV debe tener 3 caracteres" }),
	tipo: z.enum(["debito", "credito"], {
		errorMap: () => ({ message: "Tipo de tarjeta inválido" }),
	}),
	limiteCredito: z
		.number({
			invalid_type_error: "El límite de crédito debe ser un número",
		})
		.nonnegative({ message: "El límite de crédito no puede ser negativo" })
		.default(0),
	saldoDisponible: z
		.number({
			invalid_type_error: "El saldo disponible debe ser un número",
		})
		.nonnegative({ message: "El saldo disponible no puede ser negativo" })
		.default(0),
	activa: z
		.boolean({
			invalid_type_error: "Activa debe ser true o false",
		})
		.default(true),
	cuenta: cuentaSchema.optional(), // Relación con la cuenta asociada
});

export const crearTarjeta = tarjetaSchema.omit({
	idTarjeta: true,
});

