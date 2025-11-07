import { z } from "zod";
import {crearCuentaSchema, cuentaSchema} from "./cuenta.js";

export const transaccionSchema = z.object({
  idTransaccion: z
    .number()
    .int()
    .positive({
      message: "El id de la transacción debe ser un número entero positivo",
    })
    .optional(),
  cuentaOrigen: cuentaSchema.nullable().optional(),
  cuentaDestino: cuentaSchema.nullable().optional(),
  Monto: z.coerce
    .number({ invalid_type_error: "El monto debe ser un número" })
    .positive({ message: "El monto debe ser mayor a 0" }),
  Fecha: z.coerce.date({ invalid_type_error: "La fecha debe ser válida" }),
  Tipo: z
    .string()
    .transform((val) => val?.toLowerCase().trim())
    .pipe(
      z.enum(["deposito", "retiro", "transferencia", "pago"], {
        errorMap: () => ({ message: "Tipo de transacción inválido" }),
      })
    )
    .optional(),

  Descripcion: z
    .string()
    .max(255, { message: "La descripción no puede superar 255 caracteres" })
    .nullable()
    .optional(),
  Estado: z
    .enum(["pendiente", "completado", "cancelado"], {
      errorMap: () => ({ message: "Estado inválido" }),
    })
    .default("completado"),
});


export const CrearTransaccionSchema = z.object({
  IdCuentaOrigen: z.number()
		.int()
		.positive({ message: "El id de la cuenta origen debe ser un número entero positivo" })
		.nullable()
    .optional(),
  IdCuentaDestino: z.number()
		.int()
		.positive({ message: "El id de la cuenta origen debe ser un número entero positivo" })
		.nullable()
    .optional(),
  Monto: z.coerce
    .number({ invalid_type_error: "El monto debe ser un número" })
    .positive({ message: "El monto debe ser mayor a 0" }),
  Fecha: z.union([z.string().datetime(), z.date()]),
  Tipo: z.enum(["deposito", "retiro", "transferencia", "pago"], {
    errorMap: () => ({ message: "Tipo de transacción inválido" }),
  }),
  Descripcion: z
    .string()
    .max(255, { message: "La descripción no puede superar 255 caracteres" })
    .nullable()
    .optional(),
  Estado: z
    .enum(["pendiente", "completado", "cancelado"], {
      errorMap: () => ({ message: "Estado inválido" }),
    })
    .default("completado"),
});

export const editarTransaccionSchema = CrearTransaccionSchema.partial();