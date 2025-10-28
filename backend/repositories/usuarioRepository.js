import db from  "../db.js";
import { usuarioSchema } from "../models/usuario.js";
import { sucursalRepository } from "./sucursalRepository.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";

export const usuarioRepository = {
    async getAll() {
        const usuarios = await db("usuario")
            .join("sucursal", "usuario.IdSucursal", "sucursal.IdSucursal")
            .select("*");

        const showUsuarios = await Promise.all(
            usuarios.map(async (usuario) => {
                // Traer la sucursal asociada si querés que sea otra llamada
                const sucursal = await sucursalRepository.getId(usuario.IdSucursal);

                const usuarioConSucursal = {
                    ...usuario,
                    sucursal,
                };

                return usuarioSchema.parse(usuarioConSucursal);
            })
        );

        return showUsuarios;
    },

    async getId(id){
        const usuario = await db("usuario").where({ idUsuario: id }).first();
        if(!usuario){
            throw new Error("no se encontro el usuario");
        }
        const showUsuario = usuarioSchema.parse(usuario);
        
        return showUsuario
    }
}




