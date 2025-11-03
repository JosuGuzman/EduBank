import db from "../db.js";
import { prestamoSchema, crearPrestamo, modificarPrestamo } from "../models/prestamo.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";
import { usuarioRepository } from "./usuarioRepository.js";

export const prestamoRepository = {
    async listar() {
        const prestamos = await db("Prestamo")
            .join("Usuario", "Prestamo.IdUsuario", "Usuario.IdUsuario")
            .select("*");

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
        const prestamo = await db("Prestamo")
            .join("Usuario", "Prestamo.IdUsuario", "Usuario.IdUsuario")
            .where({ IdPrestamo: id })
            .select("*")
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
        const usuario =await usuarioRepository.getId(nuevoPrestamo.IdUsuario);

        // Calcular cuota mensual si no se proporciona
        if (!nuevoPrestamo.CuotaMensual) {
            nuevoPrestamo.CuotaMensual = this.calcularCuota(
                nuevoPrestamo.Monto,
                nuevoPrestamo.TasaInteres,
                nuevoPrestamo.PlazoMeses
            );
        }

        // Formatear fechas
        const fechaInicioMySQL = nuevoPrestamo.FechaInicio 
            ? new Date(nuevoPrestamo.FechaInicio).toISOString().slice(0, 19).replace("T", " ")
            : new Date().toISOString().slice(0, 19).replace("T", " ");

        const fechaFinMySQL = nuevoPrestamo.FechaFin
            ? new Date(nuevoPrestamo.FechaFin).toISOString().slice(0, 19).replace("T", " ")
            : null;

        const prestamoParaBD = {
            ...nuevoPrestamo,
            FechaInicio: fechaInicioMySQL,
            FechaFin: fechaFinMySQL
        };

        const [id] = await db("Prestamo").insert(prestamoParaBD);

        const prestamoShow = await this.getId(id);
        
        return prestamoSchema.parse(prestamoShow);
    },

    calcularCuota(monto, tasaInteres, plazoMeses) {
        const tasaMensual = tasaInteres / 100 / 12;
        const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / 
                        (Math.pow(1 + tasaMensual, plazoMeses) - 1);
        return parseFloat(cuota.toFixed(2));
    },

    async put(id, datos) {
        const resultado = modificarPrestamo.safeParse(datos);
        
        if (!resultado.success) {
            throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
        }

        const {data}  = resultado;

        // Validar usuario si se actualiza
        if (data.IdUsuario) {
            await usuarioRepository.getId(data.IdUsuario);
        }

        // Recalcular cuota si cambian monto, tasa o plazo
        if (data.Monto || data.TasaInteres || data.PlazoMeses) {
            const prestamoActual = await db("Prestamo").where({ IdPrestamo: id }).first();
            const monto = data.Monto || prestamoActual.Monto;
            const tasa = data.TasaInteres || prestamoActual.TasaInteres;
            const plazo = data.PlazoMeses || prestamoActual.PlazoMeses;
            
            data.CuotaMensual = this.calcularCuota(monto, tasa, plazo);
        }

        // Formatear fechas si se actualizan
        if (data.FechaInicio) {
            data.FechaInicio = new Date(data.FechaInicio).toISOString().slice(0, 19).replace("T", " ");
        }

        if (data.FechaFin) {
            data.FechaFin = new Date(data.FechaFin).toISOString().slice(0, 19).replace("T", " ");
        }

        await db("Prestamo").where({ IdPrestamo: id }).update(data);
        return await this.getId(id);
    },

    async delete(id) {
        const prestamo = await this.getId(id);
        
        if (!prestamo) {
            throw new Error("El préstamo no existe");
        }

        await db("Prestamo").where({ IdPrestamo: id }).delete();
        return prestamo;
    },

};