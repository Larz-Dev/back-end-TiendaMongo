/**
 * Rutas de las categorias
 * host + api + categorias
 */

import express from "express";
const router = express.Router();
import { check } from "express-validator";
import multer from "multer";
const upload = multer();

import {
  crearCategoria,
  obtenerCategorias,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoria.js";

// Create a new categoria
router.post(
  "/nuevo",
  upload.none(),
  [
    check("nombre", "Debe ingresar un nombre de categoria").not().isEmpty(),
    check("descripcion", "Debe ingresar una descripción de la categoria")
      .not()
      .isEmpty(),
  ],
  crearCategoria
);

// Get all categorias
router.get("/obtener", obtenerCategorias);

// Update a categoria
router.put(
  "/editar",
  upload.none(),
  [
    check("id", "Debe ingresar un ID de categoria válido").not().isEmpty(),
    check("nombre", "Debe ingresar un nombre de categoria").not().isEmpty(),
    check("descripcion", "Debe ingresar una descripción de la categoria")
      .not()
      .isEmpty(),
  ],
  actualizarCategoria
);

// Delete a categoria
router.delete(
  "/eliminar",
  upload.none(),
  [check("id", "Debe ingresar un ID de categoria válido").not().isEmpty()],
  eliminarCategoria
);

export default router;