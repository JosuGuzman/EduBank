import { z } from "zod";
import { usuarioSchema } from "./usuario.js";

export const prestamoSchema = z.object({
	IdPrestamo: z
		.number({
			invalid_type_error: "El ID del préstamo debe ser un número",
		})
		.optional(), // auto-incremental en la DB
	Monto: z.coerce
      .number({
        invalid_type_error: "El monto debe ser un número",
      })
      .nonnegative({ message: "El monto no puede ser negativo" }),

	TasaInteres: z.coerce
      .number({
        invalid_type_error: "El monto debe ser un número",
      })
      .nonnegative({ message: "El monto no puede ser negativo" })
	  .min(0, { message: "La tasa de interés no puede ser negativa" })
      .max(100, { message: "La tasa de interés no puede superar 100%" }),
	PlazoMeses: z
		.number({
			required_error: "El plazo en meses es obligatorio",
			invalid_type_error: "El plazo debe ser un número entero",
		})
		.int({ message: "El plazo debe ser un número entero" })
		.positive({ message: "El plazo debe ser positivo" }),
	FechaInicio: z.coerce.date({
		invalid_type_error: "La fecha de inicio debe ser una fecha válida",
	}),
	FechaFin: z.coerce
		.date({
			invalid_type_error: "La fecha de fin debe ser una fecha válida",
		})
		.nullable(),
	Estado: z
		.enum(["pendiente", "aprobado", "rechazado", "cancelado", "pagado"], {
			errorMap: () => ({ message: "Estado de préstamo inválido " }),
		})
		.default("pendiente"),
	CuotaMensual: z.coerce
      .number({
        invalid_type_error: "El monto debe ser un número",
      })
      .nonnegative({ message: "El monto no puede ser negativo" }),
	usuario: usuarioSchema.optional(), 
	IdUsuario: z
		.number({
			invalid_type_error: "El ID del usuario debe ser un numero",
		})
		.positive({ message: "El ID del usuario debe ser mayor a 0" })
		.optional()
});

export const crearPrestamo = prestamoSchema.omit({ IdPrestamo: true , usuario: true });

export const modificarPrestamo = crearPrestamo.partial();
