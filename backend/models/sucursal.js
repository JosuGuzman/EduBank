import { z } from "zod";

export const sucursalSchema = z.object({
  idSucursal: z.number(),
  nombre: z.string(),
  ciudad: z.string(),
  direccion: z.string(),
  telefono: z.string(),
  email: z.email(),
  estado: z.boolean().default(true),

});

export const Sucursal = sucursalSchema;

export const crearSucursalSchema = sucursalSchema.omit({ idSucursal: true });
