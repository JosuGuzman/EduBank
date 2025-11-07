import db from "../db.js";
import { auditoriaSchema, crearAuditoria, editarAuditoria } from "../models/auditoria.js";
import { usuarioRepository } from "./usuarioRepository.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";

export const auditoriaRepository = {
	async listar() {
		const auditorias = await db("Auditoria")
        .join("Usuario", "Auditoria.IdUsuario", "Usuario.IdUsuario")
        .select("*");

		const showAuditorias = await Promise.all(
            auditorias.map(async (auditoria) => {
                const usuario = await usuarioRepository.getId(auditoria.IdUsuario);
                
                const auditoriaCompleto = {
                    ...auditoria,
                    usuario
                };

                return auditoriaSchema.parse(auditoriaCompleto);
            })
        );

        return showAuditorias;
	},
	async getId(id){
		const auditoria = await db("Auditoria").where({ IdAuditoria: id }).first();
		if(!auditoria){
			throw new Error("La auditoria con id " + id + " no existe");
		}
        const usuario = await usuarioRepository.getId(auditoria.IdUsuario);
        
        const auditoriaCompleto = {
            ...auditoria,
            usuario
        };

		return auditoriaSchema.parse(auditoriaCompleto);
	},
	async crear(datos) {
		
		const nuevaAuditoria = crearAuditoria.parse(datos);

		const [id] = await db("Auditoria").insert(nuevaAuditoria);

        const showAuditoria = await this.getId(id);
		return showAuditoria;
	},
	async put(id, datos) {
		const resultado = editarAuditoria.safeParse(datos);

		if (!resultado.success) {
			throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
		}
		const { data } = resultado;
		
        await db("Auditoria").where({ IdAuditoria: id }).update(data);

		const auditoriaUpdate = await this.getId(id);

		return auditoriaUpdate;
	},
	async delete(id){
		const auditoria = this.getId(id);

		if (!auditoria) {
			throw new Error("La Auditoria con id " + id + " no existe");
		}

		await db("Auditoria").where({ IdAuditoria: id }).delete();
		
        return auditoria;
	}
};