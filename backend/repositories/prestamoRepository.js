import db from "../db.js";
import { prestamoSchema, crearPrestamo } from "../models/prestamo.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";
import { usuarioRepository } from "./usuarioRepository.js";

export const prestamoRepository = {
    async listar() {
        const prestamos = await db("prestamo")
            .join("usuario", "prestamo.IdUsuario", "usuario.IdUsuario")
            .select("prestamo.*", "usuario.Nombre", "usuario.DNI");

        const showPrestamos = await Promise.all(
            prestamos.map(async (prestamo) => {
                const usuario = await usuarioRepository.getId(prestamo.IdUsuario);
                
                const prestamoCompleto = {
                    ...prestamo,
                    usuario
                };

                return prestamoSchema.parse(prestamoCompleto);
            })
        );

        return showPrestamos;
    },

    async getId(id) {
        const prestamo = await db("prestamo")
            .join("usuario", "prestamo.IdUsuario", "usuario.IdUsuario")
            .where({ IdPrestamo: id })
            .select("prestamo.*", "usuario.Nombre", "usuario.DNI")
            .first();

        if (!prestamo) {
            throw new Error("No se encontró el préstamo");
        }

        const usuario = await usuarioRepository.getId(prestamo.IdUsuario);
        
        const prestamoCompleto = {
            ...prestamo,
            usuario
        };

        return prestamoSchema.parse(prestamoCompleto);
    },

    async crear(datos) {
        const nuevoPrestamo = crearPrestamo.parse(datos);

        // Validar que el usuario existe
        await usuarioRepository.getId(nuevoPrestamo.IdUsuario);

        // Calcular cuota mensual si no se proporciona
        if (!nuevoPrestamo.cuotaMensual) {
            nuevoPrestamo.cuotaMensual = this.calcularCuota(
                nuevoPrestamo.monto,
                nuevoPrestamo.tasaInteres,
                nuevoPrestamo.plazoMeses
            );
        }

        // Formatear fechas
        const fechaInicioMySQL = nuevoPrestamo.fechaInicio 
            ? new Date(nuevoPrestamo.fechaInicio).toISOString().slice(0, 19).replace("T", " ")
            : new Date().toISOString().slice(0, 19).replace("T", " ");

        const fechaFinMySQL = nuevoPrestamo.fechaFin 
            ? new Date(nuevoPrestamo.fechaFin).toISOString().slice(0, 19).replace("T", " ")
            : null;

        const prestamoParaBD = {
            ...nuevoPrestamo,
            fechaInicio: fechaInicioMySQL,
            fechaFin: fechaFinMySQL
        };

        const [id] = await db("prestamo").insert(prestamoParaBD);
        return await this.getId(id);
    },

    calcularCuota(monto, tasaInteres, plazoMeses) {
        const tasaMensual = tasaInteres / 100 / 12;
        const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / 
                        (Math.pow(1 + tasaMensual, plazoMeses) - 1);
        return parseFloat(cuota.toFixed(2));
    },

    async put(id, datos) {
        const resultado = crearPrestamo.partial().safeParse(datos);
        
        if (!resultado.success) {
            throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
        }

        const { data } = resultado;

        // Validar usuario si se actualiza
        if (data.IdUsuario) {
            await usuarioRepository.getId(data.IdUsuario);
        }

        // Recalcular cuota si cambian monto, tasa o plazo
        if (data.monto || data.tasaInteres || data.plazoMeses) {
            const prestamoActual = await db("prestamo").where({ IdPrestamo: id }).first();
            const monto = data.monto || prestamoActual.Monto;
            const tasa = data.tasaInteres || prestamoActual.TasaInteres;
            const plazo = data.plazoMeses || prestamoActual.PlazoMeses;
            
            data.cuotaMensual = this.calcularCuota(monto, tasa, plazo);
        }

        // Formatear fechas si se actualizan
        if (data.fechaInicio) {
            data.fechaInicio = new Date(data.fechaInicio).toISOString().slice(0, 19).replace("T", " ");
        }

        if (data.fechaFin) {
            data.fechaFin = new Date(data.fechaFin).toISOString().slice(0, 19).replace("T", " ");
        }

        await db("prestamo").where({ IdPrestamo: id }).update(data);
        return await this.getId(id);
    },

    async delete(id) {
        const prestamo = await db("prestamo").where({ IdPrestamo: id }).first();
        
        if (!prestamo) {
            throw new Error("El préstamo no existe");
        }

        await db("prestamo").where({ IdPrestamo: id }).delete();
        return prestamo;
    },

    async listarPorUsuario(idUsuario) {
        const prestamos = await db("prestamo")
            .where({ IdUsuario: idUsuario })
            .select("*");

        return await Promise.all(
            prestamos.map(async (prestamo) => {
                const usuario = await usuarioRepository.getId(prestamo.IdUsuario);
                return prestamoSchema.parse({ ...prestamo, usuario });
            })
        );
    },

    async aprobarPrestamo(id) {
        const prestamo = await this.getId(id);
        
        if (prestamo.estado !== "pendiente") {
            throw new Error("Solo se pueden aprobar préstamos pendientes");
        }

        await db("prestamo")
            .where({ IdPrestamo: id })
            .update({ estado: "aprobado" });

        return await this.getId(id);
    }
};