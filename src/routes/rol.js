/**
 * Rutas de los roles
 * host +api+roles
 */

import express from "express";
const router = express.Router();
import { check } from "express-validator";
import multer from "multer";
import {
  crearRol,
  obtenerRoles,
  actualizarRol,
  eliminarRol,
} from "../controllers/rol.js";
const upload = multer();

// Create a new role
router.post(
  "/nuevo",
  upload.none(),
  [
    check("nombre", "Debe ingresar un nombre de rol").not().isEmpty(),
    check("descripcion", "Debe ingresar una descripción del rol")
      .not()
      .isEmpty(),
  ],
  crearRol
);

// Get all roles
router.get("/obtener", obtenerRoles);

// Update a role
router.put(
  "/editar",
  upload.none(),
  [
    check("id", "Debe ingresar un ID de rol válido").not().isEmpty(),
    check("nombre", "Debe ingresar un nombre de rol").not().isEmpty(),
    check("descripcion", "Debe ingresar una descripción del rol")
      .not()
      .isEmpty(),
  ],
  actualizarRol
);

// Delete a role
router.delete(
  "/eliminar",
  upload.none(),
  [check("id", "Debe ingresar un ID de rol válido").not().isEmpty()],
  eliminarRol
);

export default router;
