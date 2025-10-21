import { z } from "zod";

export const tipoCuentaSchema = z.object({
  idTipoCuenta: z.number(),            // auto-incremental en la DB
  nombre: z.string().min(1).max(50),
  descripcion: z.string().max(200).optional(),
  permiteCredito: z.boolean().default(false),
  moneda: z.string().max(10).default("ARS"),
  tasaInteres: z.number().nonnegative().default(0),
});

export const TipoCuenta = tipoCuentaSchema;

export const crearTipoCuentaSchema = tipoCuentaSchema.omit({ idTipoCuenta: true });

