import db from "../db.js";
import { sucursalSchema } from "../models/sucursal.js";

export const sucursalRepositorie ={
    async listar(){
        return await db("sucursal").select("*");
    }
}