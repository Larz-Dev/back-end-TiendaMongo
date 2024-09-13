import express from "express";
import { check } from "express-validator";
import multer from "multer";
const upload = multer();
import {
  crearFactura,
  obtenerFacturas,
  actualizarFactura,
  eliminarFactura,
  obtenerFacturaCliente
} from "../controllers/Factura-Detalle.js";


const router = express.Router();
const validarFactura = [
    check("ID_Usuario", "ID_Usuario es requerido").not().isEmpty(),
    check("fecha", "Fecha es requerida").not().isEmpty(),
    check("total", "Total es requerido").not().isEmpty(),
    check("iva", "IVA es requerido").not().isEmpty(),
    check("productos", "Productos es requerido").not().isEmpty(),
    check("detalles", "Detalles es requerido").not().isEmpty(),
    check("codigoFactura", "Detalles es requerido").not().isEmpty(),
  ];
// Crear una nueva factura
router.post("/crear", validarFactura, crearFactura);

// Obtener todas las facturas
router.get("/listar", obtenerFacturas);

router.post("/obtener", upload.none(), obtenerFacturaCliente);

// Actualizar una factura
router.put("/actualizar", validarFactura, actualizarFactura);

// Eliminar una factura
router.delete("/eliminar", eliminarFactura);

export default router;