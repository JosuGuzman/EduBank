import db from "../db.js";
import { tarjetaSchema, crearTarjetaSchema } from "../models/tarjeta.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";
import { cuentaRepository } from "./cuentaRepository.js";

export const tarjetaRepository = {
    async listar() {
        const tarjetas = await db("tarjeta")
            .join("cuenta", "tarjeta.IdCuenta", "cuenta.IdCuenta")
            .select("*");

        const showTarjetas = await Promise.all(
            tarjetas.map(async (tarjeta) => {
                const cuenta = await cuentaRepository.getId(tarjeta.IdCuenta);
                
                const tarjetaCompleta = {
                    ...tarjeta,
                    cuenta
                };

                return tarjetaSchema.parse(tarjetaCompleta);
            })
        );

        return showTarjetas;
    },

    async getId(id) {
        const tarjeta = await db("tarjeta")
            .join("cuenta", "tarjeta.IdCuenta", "cuenta.IdCuenta")
            .where({ IdTarjeta: id })
            .select("*")
            .first();

        if (!tarjeta) {
            throw new Error("No se encontró la tarjeta");
        }

        const cuenta = await cuentaRepository.getId(tarjeta.IdCuenta);
        
        const tarjetaCompleta = {
            ...tarjeta,
            cuenta
        };

        return tarjetaSchema.parse(tarjetaCompleta);
    },

    async crear(datos) {
        const nuevaTarjeta = crearTarjetaSchema.parse(datos);

        // Formatear fecha de vencimiento
        const fechaVencimientoMySQL = new Date(nuevoUsuario.FechaAlta)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        const tarjetaParaBD = {
            ...nuevaTarjeta,
            FechaVencimiento: fechaVencimientoMySQL
        };

        const [id] = await db("tarjeta").insert(tarjetaParaBD);
        return await this.getId(id);
    },

    async put(id, datos) {
        const resultado = crearTarjeta.partial().safeParse(datos);
        
        if (!resultado.success) {
            throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
        }

        const { data } = resultado;

        // Validar cuenta si se actualiza
        if (data.IdCuenta) {
            await cuentaRepository.getId(data.IdCuenta);
        }

        // Formatear fecha si se actualiza
        if (data.fechaVencimiento) {
            data.fechaVencimiento = new Date(data.fechaVencimiento).toISOString().slice(0, 10);
        }

        await db("tarjeta").where({ IdTarjeta: id }).update(data);
        return await this.getId(id);
    },

    async delete(id) {
        const tarjeta = await db("tarjeta").where({ IdTarjeta: id }).first();
        
        if (!tarjeta) {
            throw new Error("La tarjeta no existe");
        }

        await db("tarjeta").where({ IdTarjeta: id }).delete();
        return tarjeta;
    },

    async listarPorCuenta(idCuenta) {
        const tarjetas = await db("tarjeta")
            .where({ IdCuenta: idCuenta })
            .select("*");

        return await Promise.all(
            tarjetas.map(async (tarjeta) => {
                const cuenta = await cuentaRepository.getId(tarjeta.IdCuenta);
                return tarjetaSchema.parse({ ...tarjeta, cuenta });
            })
        );
    }
};