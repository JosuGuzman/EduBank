import { z } from "zod";
import { cuentaSchema } from "./cuenta.js";

export const tarjetaSchema = z
  .object({
    idTarjeta: z
      .number({
        invalid_type_error: "El ID de la tarjeta debe ser un número",
      })
      .optional(), // auto-incremental en la DB

    NumeroTarjeta: z
      .string({
        required_error: "El número de tarjeta es obligatorio",
        invalid_type_error: "El número de tarjeta debe ser un texto",
      })
      .length(16, { message: "El número de tarjeta debe tener 16 caracteres" }),

    FechaVencimiento: z.coerce.date({
      invalid_type_error: "La fecha de vencimiento debe ser válida",
    }),

    CVV: z
      .string({
        required_error: "El CVV es obligatorio",
        invalid_type_error: "El CVV debe ser un texto",
      })
      .length(3, { message: "El CVV debe tener 3 caracteres" }),

    Tipo: z.enum(["debito", "credito"], {
      errorMap: () => ({ message: "Tipo de tarjeta inválido" }),
    }),

    LimiteCredito: z.coerce
      .number({
        invalid_type_error: "El monto debe ser un número",
      })
      .nonnegative({ message: "El monto no puede ser negativo" }), // ✅ permite 0

    SaldoDisponible: z.coerce
      .number({
        invalid_type_error: "El monto debe ser un número",
      })
      .nonnegative({ message: "El monto no puede ser negativo" }),

    Activa: z.union([z.boolean(), z.number().transform((n) => Boolean(n))]),

    cuenta: cuentaSchema.optional(),
  })

  //  Validacion: Débito → LimiteCredito debe ser 0
  //  Credito → LimiteCredito > 0
  .refine(
    (data) =>
      (data.Tipo === "debito" && data.LimiteCredito === 0) ||
      (data.Tipo === "credito" && data.LimiteCredito > 0),
    {
      message:
        "Las tarjetas de débito deben tener límite de crédito 0, y las de crédito un límite mayor a 0",
      path: ["LimiteCredito"],
    }
  )

  // Validacion: Crédito → SaldoDisponible ≤ LimiteCredito
  .refine(
    (data) =>
      data.Tipo === "debito" ||
      (data.Tipo === "credito" && data.SaldoDisponible <= data.LimiteCredito),
    {
      message:
        "El saldo disponible no puede superar el límite de crédito en las tarjetas de crédito",
      path: ["SaldoDisponible"],
    }
  );

export const crearTarjetaSchema = z
  .object({
    NumeroTarjeta: z
      .string({
        required_error: "El número de tarjeta es obligatorio",
        invalid_type_error: "El número de tarjeta debe ser un texto",
      })
      .length(16, { message: "El número de tarjeta debe tener 16 caracteres" }),

    FechaVencimiento: z.coerce.date({
      invalid_type_error: "La fecha de vencimiento debe ser válida",
    }),

    CVV: z
      .string({
        required_error: "El CVV es obligatorio",
        invalid_type_error: "El CVV debe ser un texto",
      })
      .length(3, { message: "El CVV debe tener 3 caracteres" }),

    Tipo: z.enum(["debito", "credito"], {
      errorMap: () => ({ message: "Tipo de tarjeta inválido" }),
    }),

    LimiteCredito: z.coerce
      .number({
        invalid_type_error: "El monto debe ser un número",
      })
      .nonnegative({ message: "El monto no puede ser negativo" }), 

    SaldoDisponible: z.coerce
      .number({
        invalid_type_error: "El monto debe ser un número",
      })
      .nonnegative({ message: "El monto no puede ser negativo" }),

    Activa: z.union([z.boolean(), z.number().transform((n) => Boolean(n))]),

    IdCuenta: z
      .number({
        invalid_type_error: "El ID de la cuenta debe ser un número",
      })
      .int({ message: "El ID debe ser un número entero" })
      .positive({ message: "El ID debe ser positivo" })
      .optional(),
  })

  .refine(
    (data) =>
      (data.Tipo === "debito" && data.LimiteCredito === 0) ||
      (data.Tipo === "credito" && data.LimiteCredito > 0),
    {
      message:
        "Las tarjetas de débito deben tener límite de crédito 0, y las de crédito un límite mayor a 0",
      path: ["LimiteCredito"],
    }
  )

  .refine(
    (data) =>
      data.Tipo === "debito" ||
      (data.Tipo === "credito" && data.SaldoDisponible <= data.LimiteCredito),
    {
      message:
        "El saldo disponible no puede superar el límite de crédito en las tarjetas de crédito",
      path: ["SaldoDisponible"],
    }
  );

export const editarTarjetaSchema = crearTarjetaSchema.partial();