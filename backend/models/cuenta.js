import { z } from "zod";
import { usuarioSchema } from "./usuario.js";
import { tipoCuentaSchema } from "./tipoCuenta.js";
import { sucursalSchema } from "./sucursal.js";

export const cuentaSchema = z.object({
	idCuenta: z.number(),
	cbu: z.string().length(22),
	alias: z.string().max(30).optional(),
	saldo: z.number().default(0.0),
	fechaApertura: z.string().datetime(),
	activa: z.boolean().default(true),
	usuario: usuarioSchema, // Objeto Usuario con sucursal anidada si querés
	tipoCuenta: tipoCuentaSchema, // Objeto TipoCuenta
	sucursal: sucursalSchema, // Objeto Sucursal de la cuenta
});

export const Cuenta = cuentaSchema;

export const crearCuentaSchema = z.object({
	idUsuario: z.number(),
	idTipoCuenta: z.number(),
	idSucursal: z.number(),
	cbu: z.string().length(22),
	alias: z.string().max(30).optional(),
	saldo: z.number().default(0.0),
	activa: z.boolean().default(true),
});


