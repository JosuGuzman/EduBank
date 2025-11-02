import db from "../db.js";
import { editarCuentaSchema } from "../models/cuenta.js";
import { transaccionSchema, CrearTransaccionSchema, editarTransaccionSchema} from "../models/transaccion.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";
import { cuentaRepository } from "./cuentaRepository.js";

export const transaccionRepository = {
    async listar() {
        const transacciones = await db("Transaccion")
            .join("Cuenta as origen", "Transaccion.IdCuentaOrigen", "origen.IdCuenta")
            .join("Cuenta as destino", "Transaccion.IdCuentaDestino", "destino.IdCuenta")
            .select(
                "*"
            );

        const showTransacciones = await Promise.all(
            transacciones.map(async (transaccion) => {
                const cuentaOrigen = await cuentaRepository.getId(transaccion.IdCuentaOrigen);
                const cuentaDestino = await cuentaRepository.getId(transaccion.IdCuentaDestino);

                const transaccionCompleta = {
                  ...transaccion,
                  cuentaOrigen,
                  cuentaDestino,
                };

                return transaccionSchema.parse(transaccionCompleta);
            })
        );

        return showTransacciones;
    },

    async getId(id) {
        const transaccion = await db("Transaccion")
            .leftJoin("Cuenta as origen", "Transaccion.IdCuentaOrigen", "origen.IdCuenta")
            .leftJoin("Cuenta as destino", "Transaccion.IdCuentaDestino", "destino.IdCuenta")
            .where({ IdTransaccion: id })
            .select(
                "*"
            )
            .first();

        if (!transaccion) {
            throw new Error("No se encontró la transacción");
        }

        const cuentaOrigen = await cuentaRepository.getId(transaccion.IdCuentaOrigen);
        const cuentaDestino = await cuentaRepository.getId(transaccion.IdCuentaDestino);

        const transaccionCompleta = {
            ...transaccion,
            cuentaOrigen,
            cuentaDestino
        };
        
        const showTransaccion = transaccionSchema.parse(transaccionCompleta);

        return showTransaccion;
    },

    async crear(datos) {
        const nuevaTransaccion = CrearTransaccionSchema.parse(datos);

        const fechaMySQL = new Date(nuevaTransaccion.Fecha)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        const transaccionParaBD = {
            ...nuevaTransaccion,
            Fecha: fechaMySQL
        };

        const [id] = await db("Transaccion").insert(transaccionParaBD);
        
        if (nuevaTransaccion.estado === "completado") {
            await this.actualizarSaldos(nuevaTransaccion);
        }

        return await this.getId(id);
    },

    async actualizarSaldos(transaccion) {
        const { tipo, monto, idCuentaOrigen, idCuentaDestino } = transaccion;

        switch (tipo) {
            case "deposito":
                if (idCuentaDestino) {
                    await db("Cuenta")
                        .where({ IdCuenta: idCuentaDestino })
                        .increment("Saldo", monto);
                }
                break;

            case "retiro":
                if (idCuentaOrigen) {
                    await db("Cuenta")
                        .where({ IdCuenta: idCuentaOrigen })
                        .decrement("Saldo", monto);
                }
                break;

            case "transferencia":
                if (idCuentaOrigen && idCuentaDestino) {
                    await db.transaction(async (trx) => {
                        await trx("Cuenta")
                            .where({ IdCuenta: idCuentaOrigen })
                            .decrement("Saldo", monto);

                        await trx("Cuenta")
                            .where({ IdCuenta: idCuentaDestino })
                            .increment("Saldo", monto);
                    });
                }
                break;
        }
    },

async put(id, datos) {
    const resultado = editarTransaccionSchema.safeParse(datos);
    
    if (!resultado.success) {
        throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
    }

    const { data } = resultado;

    if (data.IdCuentaOrigen) {
        await cuentaRepository.getId(data.IdCuentaOrigen);
    }

    if (data.IdCuentaDestino) {
        await cuentaRepository.getId(data.IdCuentaDestino);
    }

    if (data.Fecha) {
        data.Fecha = new Date(data.Fecha).toISOString().slice(0, 19).replace("T", " ");
    }

    await db("Transaccion").where({ IdTransaccion: id }).update(data);

    if (data.Estado === "completado") {
        const transaccion = await this.getId(id);
        await this.actualizarSaldos(transaccion);
    }

    return await this.getId(id);
},


    async delete(id) {
        const transaccion = await db("Transaccion").where({ IdTransaccion: id }).first();
        
        if (!transaccion) {
            throw new Error("La transacción no existe");
        }

        // 🔄 REVERTIR SALDOS SI LA TRANSACCIÓN ESTABA COMPLETADA
        if (transaccion.Estado === "completado") {
            await this.revertirSaldos(transaccion);
        }

        await db("Transaccion").where({ IdTransaccion: id }).delete();
        
        return transaccion;
    },

    async revertirSaldos(transaccion) {
        const { Tipo, Monto, IdCuentaOrigen, IdCuentaDestino } = transaccion;

        switch (Tipo) {
            case "deposito":
                if (IdCuentaDestino) {
                    await db("Cuenta")
                        .where({ IdCuenta: IdCuentaDestino })
                        .decrement("Saldo", Monto);
                }
                break;

            case "retiro":
                if (IdCuentaOrigen) {
                    await db("Cuenta")
                        .where({ IdCuenta: IdCuentaOrigen })
                        .increment("Saldo", Monto);
                }
                break;

            case "transferencia":
                if (IdCuentaOrigen && IdCuentaDestino) {
                    await db.transaction(async (trx) => {
                        await trx("Cuenta")
                            .where({ IdCuenta: IdCuentaOrigen })
                            .increment("Saldo", Monto);

                        await trx("Cuenta")
                            .where({ IdCuenta: IdCuentaDestino })
                            .decrement("Saldo", Monto);
                    });
                }
                break;
        }
    }
};