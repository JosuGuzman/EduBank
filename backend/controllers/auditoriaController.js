import { auditoriaRepository } from "../repositories/auditoriaRepository.js";

export const auditoriaController = {
  listar: async (req, res) => {
    try {
      const auditorias = await auditoriaRepository.listar();
      
      return res.status(200).json(auditorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getId: async (req, res) => {
    try {
      const id = req.params.id;
      const auditoria = await auditoriaRepository.getId(id);
      return res.status(200).json(auditoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  crear: async (req, res) => {
    try {
      const nuevaAuditoria = await auditoriaRepository.crear(req.body);


      return res.status(200).json(nuevaAuditoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  put: async (req, res) => {
    try{
        const id = req.params.id;
        const nuevoAuditoria = await auditoriaRepository.put(id, req.body);
        return res.status(200).json(nuevoAuditoria);
    }
    catch (error) {
      let errores = {};
      try {
        errores = JSON.parse(error.message); 
      } catch {
        errores.general = error.message;
      }
      res.status(400).json({
        errores,
      });
    }
  },
  delete: async (req, res) => {
    try{
        const id = req.params.id;
        const auditoria = await auditoriaRepository.delete(id);
        return res.status(200).json(auditoria);
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}