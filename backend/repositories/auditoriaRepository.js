import db from "../db.js";
import { auditoriaSchema, crearAuditoria } from "../models/auditoria.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";
import { usuarioRepository } from "./usuarioRepository.js";

export const auditoriaRepository = {
    async listar() {
        const auditorias = await db("auditoria")
            .leftJoin("usuario", "auditoria.IdUsuario", "usuario.IdUsuario")
            .select("auditoria.*", "usuario.Nombre", "usuario.DNI");

        const showAuditorias = await Promise.all(
            auditorias.map(async (auditoria) => {
                let usuario = null;
                
                if (auditoria.IdUsuario) {
                    usuario = await usuarioRepository.getId(auditoria.IdUsuario);
                }

                const auditoriaCompleta = {
                    ...auditoria,
                    usuario
                };

                return auditoriaSchema.parse(auditoriaCompleta);
            })
        );

        return showAuditorias;
    },

    async getId(id) {
        const auditoria = await db("auditoria")
            .leftJoin("usuario", "auditoria.IdUsuario", "usuario.IdUsuario")
            .where({ IdAuditoria: id })
            .select("auditoria.*", "usuario.Nombre", "usuario.DNI")
            .first();

        if (!auditoria) {
            throw new Error("No se encontró el registro de auditoría");
        }

        let usuario = null;
        if (auditoria.IdUsuario) {
            usuario = await usuarioRepository.getId(auditoria.IdUsuario);
        }

        const auditoriaCompleta = {
            ...auditoria,
            usuario
        };

        return auditoriaSchema.parse(auditoriaCompleta);
    },

    async crear(datos) {
        const nuevaAuditoria = crearAuditoria.parse(datos);

        // Validar usuario si se proporciona
        if (nuevaAuditoria.IdUsuario) {
            await usuarioRepository.getId(nuevaAuditoria.IdUsuario);
        }

        const fechaMySQL = nuevaAuditoria.fecha 
            ? new Date(nuevaAuditoria.fecha).toISOString().slice(0, 19).replace("T", " ")
            : new Date().toISOString().slice(0, 19).replace("T", " ");

        const auditoriaParaBD = {
            ...nuevaAuditoria,
            fecha: fechaMySQL
        };

        const [id] = await db("auditoria").insert(auditoriaParaBD);
        return await this.getId(id);
    },

    async registrarAccion(accionData) {
        const datosAuditoria = {
            accion: accionData.accion,
            detalle: accionData.detalle,
            ip: accionData.ip,
            IdUsuario: accionData.IdUsuario || null
        };

        return await this.crear(datosAuditoria);
    },

    async listarPorUsuario(idUsuario) {
        const auditorias = await db("auditoria")
            .where({ IdUsuario: idUsuario })
            .select("*");

        return await Promise.all(
            auditorias.map(async (auditoria) => {
                let usuario = null;
                if (auditoria.IdUsuario) {
                    usuario = await usuarioRepository.getId(auditoria.IdUsuario);
                }
                return auditoriaSchema.parse({ ...auditoria, usuario });
            })
        );
    },

    async listarPorFecha(inicio, fin) {
        const auditorias = await db("auditoria")
            .whereBetween("Fecha", [inicio, fin])
            .select("*");

        return await Promise.all(
            auditorias.map(async (auditoria) => {
                let usuario = null;
                if (auditoria.IdUsuario) {
                    usuario = await usuarioRepository.getId(auditoria.IdUsuario);
                }
                return auditoriaSchema.parse({ ...auditoria, usuario });
            })
        );
    }
};