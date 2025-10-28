import db from  "../db.js";
import { usuarioSchema, editarUsuarioSchema, usuarioInputSchema } from "../models/usuario.js";
import { sucursalRepository } from "./sucursalRepository.js";
import { formatearErroresZod } from "../utils/staticFunctions.js";
import bcrypt from "bcrypt";

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
        const usuario = await db("usuario")
            .join("sucursal", "usuario.IdSucursal", "sucursal.IdSucursal")
            .where({ idUsuario: id }).first();
        if(!usuario){
            throw new Error("no se encontro el usuario");
        }
        const sucursal = await sucursalRepository.getId(usuario.IdSucursal);
        const usuarioConSucursal = {
            ...usuario,
            sucursal,
        };
        const showUsuario = usuarioSchema.parse(usuarioConSucursal);
        
        return showUsuario
    },
    async crear(datos){
        const nuevoUsuario = usuarioInputSchema.parse(datos);

        const fechaMySQL = new Date(nuevoUsuario.FechaAlta).toISOString().slice(0, 19).replace("T", " ");

        const hashedPassword = await bcrypt.hash(nuevoUsuario.PasswordHash, 10);

        const nuevoUsuarioParaBd = {
            ...nuevoUsuario,
            FechaAlta: fechaMySQL,
            PasswordHash: hashedPassword
        };
        
        await db("usuario").insert(nuevoUsuarioParaBd);

        const sucursal = await sucursalRepository.getId(nuevoUsuario.IdSucursal);

        const nuevoUsuarioConSucursal = {
            ...nuevoUsuario,
            sucursal,
        };

        const showUsuario = usuarioSchema.parse(nuevoUsuarioConSucursal);
        return { showUsuario };
    },
    async put(id,datos){
        const resultado = editarUsuarioSchema.safeParse(datos);
        if (!resultado.success) {
            throw new Error(JSON.stringify(formatearErroresZod(resultado.error)));
        }
        const { data } = resultado;
        await db("usuario").where({ idUsuario: id }).update(data);
        const usuarioUpdate = await db("usuario").where({ idUsuario: id }).first();
        return { ...usuarioUpdate, ...data };
    },
    async delete(id){
        const usuario = await db("usuario").where({ idUsuario: id }).first();
        if (!usuario) {
            throw new Error("El usuario no existe");
        }
        await db("usuario").where({ idUsuario: id }).delete();
        return usuario;
    }
}