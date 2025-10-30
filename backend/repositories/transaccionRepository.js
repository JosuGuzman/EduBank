import db from "../db.js";
import { transaccionSchema, transaccionCreate } from "../models/transaccion.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";
import { cuentaRepository } from "./cuentaRepository.js";

export const transaccionRepository = {
    async listar() {
        const transacciones = await db("transaccion")
            .join("cuenta as origen", "transaccion.IdCuentaOrigen", "origen.IdCuenta")
            .join("cuenta as destino", "transaccion.IdCuentaDestino", "destino.IdCuenta")
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
        const transaccion = await db("transaccion")
            .leftJoin("cuenta as origen", "transaccion.IdCuentaOrigen", "origen.IdCuenta")
            .leftJoin("cuenta as destino", "transaccion.IdCuentaDestino", "destino.IdCuenta")
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
        const nuevaTransaccion = transaccionCreate.parse(datos);

        // Validar que las cuentas existan si se proporcionan
        if (nuevaTransaccion.idCuentaOrigen) {
            await cuentaRepository.getId(nuevaTransaccion.idCuentaOrigen);
        }

        if (nuevaTransaccion.idCuentaDestino) {
            await cuentaRepository.getId(nuevaTransaccion.idCuentaDestino);
        }

        const fechaMySQL = nuevaTransaccion.fecha 
            ? new Date(nuevaTransaccion.fecha).toISOString().slice(0, 19).replace("T", " ")
            : new Date().toISOString().slice(0, 19).replace("T", " ");

        const transaccionParaBD = {
            ...nuevaTransaccion,
            fecha: fechaMySQL
        };

        const [id] = await db("transaccion").insert(transaccionParaBD);
        
        // 🔄 ACTUALIZAR SALDOS DE CUENTAS SI LA TRANSACCIÓN ES COMPLETADA
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
                    await db("cuenta")
                        .where({ IdCuenta: idCuentaDestino })
                        .increment("Saldo", monto);
                }
                break;

            case "retiro":
                if (idCuentaOrigen) {
                    await db("cuenta")
                        .where({ IdCuenta: idCuentaOrigen })
                        .decrement("Saldo", monto);
                }
                break;

            case "transferencia":
                if (idCuentaOrigen && idCuentaDestino) {
                    await db.transaction(async (trx) => {
                        await trx("cuenta")
                            .where({ IdCuenta: idCuentaOrigen })
                            .decrement("Saldo", monto);

                        await trx("cuenta")
                            .where({ IdCuenta: idCuentaDestino })
                            .increment("Saldo", monto);
                    });
                }
                break;
        }
    },

    async put(id, datos) {
        const resultado = transaccionCreate.partial().safeParse(datos);
        
        if (!resultado.success) {
            throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
        }

        const { data } = resultado;

        // Validar cuentas si se actualizan
        if (data.idCuentaOrigen) {
            await cuentaRepository.getId(data.idCuentaOrigen);
        }

        if (data.idCuentaDestino) {
            await cuentaRepository.getId(data.idCuentaDestino);
        }

        // Formatear fecha si se actualiza
        if (data.fecha) {
            data.fecha = new Date(data.fecha).toISOString().slice(0, 19).replace("T", " ");
        }

        await db("transaccion").where({ IdTransaccion: id }).update(data);

        // 🔄 Si se cambia el estado a "completado", actualizar saldos
        if (data.estado === "completado") {
            const transaccion = await this.getId(id);
            await this.actualizarSaldos(transaccion);
        }

        return await this.getId(id);
    },

    async delete(id) {
        const transaccion = await db("transaccion").where({ IdTransaccion: id }).first();
        
        if (!transaccion) {
            throw new Error("La transacción no existe");
        }

        // 🔄 REVERTIR SALDOS SI LA TRANSACCIÓN ESTABA COMPLETADA
        if (transaccion.Estado === "completado") {
            await this.revertirSaldos(transaccion);
        }

        await db("transaccion").where({ IdTransaccion: id }).delete();
        
        return transaccion;
    },

    async revertirSaldos(transaccion) {
        const { Tipo, Monto, IdCuentaOrigen, IdCuentaDestino } = transaccion;

        switch (Tipo) {
            case "deposito":
                if (IdCuentaDestino) {
                    await db("cuenta")
                        .where({ IdCuenta: IdCuentaDestino })
                        .decrement("Saldo", Monto);
                }
                break;

            case "retiro":
                if (IdCuentaOrigen) {
                    await db("cuenta")
                        .where({ IdCuenta: IdCuentaOrigen })
                        .increment("Saldo", Monto);
                }
                break;

            case "transferencia":
                if (IdCuentaOrigen && IdCuentaDestino) {
                    await db.transaction(async (trx) => {
                        await trx("cuenta")
                            .where({ IdCuenta: IdCuentaOrigen })
                            .increment("Saldo", Monto);

                        await trx("cuenta")
                            .where({ IdCuenta: IdCuentaDestino })
                            .decrement("Saldo", Monto);
                    });
                }
                break;
        }
    }
};