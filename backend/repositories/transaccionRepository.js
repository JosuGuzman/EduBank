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
        .select("*")
        .first();

      if (!transaccion) {
        throw new Error("No se encontró la transacción");
      }

      // 🧩 Solo buscar si existen las cuentas
      const cuentaOrigen = transaccion.IdCuentaOrigen
        ? await cuentaRepository.getId(transaccion.IdCuentaOrigen)
        : null;

      const cuentaDestino = transaccion.IdCuentaDestino
        ? await cuentaRepository.getId(transaccion.IdCuentaDestino)
        : null;

      const transaccionCompleta = {
        ...transaccion,
        cuentaOrigen,
        cuentaDestino,
      };

      return transaccionSchema.parse(transaccionCompleta);
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
        
        if (nuevaTransaccion.Estado === "completado" || nuevaTransaccion.Estado === "cancelado") {
            await this.actualizarSaldos(nuevaTransaccion);
        }

        return await this.getId(id);
    },

async actualizarSaldos(transaccion) {
  const { Tipo, Monto, IdCuentaOrigen, IdCuentaDestino, Estado } = transaccion;

  if (Estado !== "completado" && Estado !== "cancelado") return;

  await db.transaction(async (trx) => {
    switch (Tipo) {
      case "deposito":
        if (IdCuentaDestino && Estado === "completado") {
          // depositarr -> solo aumenta el saldo de destino
          await trx("Cuenta").where({ IdCuenta: IdCuentaDestino }).increment("Saldo", Monto);
        } else if (IdCuentaDestino && Estado === "cancelado") {
          // reversion del deposito
          await trx("Cuenta").where({ IdCuenta: IdCuentaDestino }).decrement("Saldo", Monto);
        }
        break;

      case "retiro":
        if (IdCuentaOrigen && Estado === "completado") {
          // retiro -> disminuye el saldo de origen
          await trx("Cuenta").where({ IdCuenta: IdCuentaOrigen }).decrement("Saldo", Monto);
        } else if (IdCuentaOrigen && Estado === "cancelado") {
          // reversion -> devolver dinero al origen
          await trx("Cuenta").where({ IdCuenta: IdCuentaOrigen }).increment("Saldo", Monto);
        }
        break;

      case "transferencia":
        if (IdCuentaOrigen && IdCuentaDestino) {
          if (Estado === "completado") {
            // transferencia -> origen -monto ------ destino +monto
            await trx("Cuenta").where({ IdCuenta: IdCuentaOrigen }).decrement("Saldo", Monto);
            await trx("Cuenta").where({ IdCuenta: IdCuentaDestino }).increment("Saldo", Monto);
          } else if (Estado === "cancelado") {
            // reversion -> origen + monto ------  destino -monto
            await trx("Cuenta").where({ IdCuenta: IdCuentaOrigen }).increment("Saldo", Monto);
            await trx("Cuenta").where({ IdCuenta: IdCuentaDestino }).decrement("Saldo", Monto);
          }
        }
        break;

      case "pago":
        if (IdCuentaOrigen && Estado === "completado") {
          await trx("Cuenta").where({ IdCuenta: IdCuentaOrigen }).decrement("Saldo", Monto);
        } else if (IdCuentaOrigen && Estado === "cancelado") {
          await trx("Cuenta").where({ IdCuenta: IdCuentaOrigen }).increment("Saldo", Monto);
        }
        break;
    }
  });
},


async put(id, datos) {
  const resultado = editarTransaccionSchema.safeParse(datos);
  
  if (!resultado.success) {
    throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
  }

  const { data } = resultado;

  const transaccionActual = await this.getId(id);
  const estadoAnterior = transaccionActual.Estado;
  const tipoOriginal = transaccionActual.Tipo;

  if (data.Tipo && data.Tipo !== tipoOriginal) {
    throw new Error("No se puede cambiar el tipo de transacción una vez creada");
  }

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


  if (data.Estado && data.Estado !== estadoAnterior) {
    const transaccion = await this.getId(id);

    const transaccionPlano = {
      IdCuentaOrigen: transaccion.cuentaOrigen?.IdCuenta ?? null,
      IdCuentaDestino: transaccion.cuentaDestino?.IdCuenta ?? null,
      Tipo: transaccion.Tipo,
      Monto: transaccion.Monto,
      Estado: transaccion.Estado
    };

    await this.actualizarSaldos(transaccionPlano);
  }

  return await this.getId(id);
},



    async delete(id) {
        const transaccion = await db("Transaccion").where({ IdTransaccion: id }).first();
        
        if (!transaccion) {
            throw new Error("La transacción no existe");
        }

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