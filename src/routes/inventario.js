/**
 * Rutas de los items
 * host +api+items
 */

import express from "express";
const router = express.Router();
import { check } from "express-validator";
import {
  crearItem,
  imagenItem,
  obtenerItems,
  editarItem,
} from "../controllers/inventario.js";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Change the name of the file here
    let format = file.mimetype.replace("image/", "");

    cb(null, file.fieldname + "-" + Date.now() + "." + format);
  },
});

const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(file.originalname.toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Subir solamente formatos de tipo imagen: (jpeg|jpg|png|gif)");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const uploadMiddleware = upload.single("photo");

// Crear item
router.post(
  "/nuevo",
  uploadMiddleware,
  [
    check("ID_Categoria", "Debe ingresar una categoría").not().isEmpty(),
    check("nombre", "Debe ingresar un nombre").not().isEmpty(),
    check("descripcion", "Debe ingresar una descripción").not().isEmpty(),
    check("cantidad", "Debe ingresar una cantidad").not().isEmpty(),
    check("precio", "Debe ingresar un precio ").not().isEmpty(),
  ],
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ Error: "No se ha encontrado la imagen" });
    }

    const tempPath = req.file.path;
    const format = req.file.mimetype.replace("image/", "");
    const tempName = "item" + "-" + Date.now() + "." + format;

    try {
      // Call the crearItem function
      crearItem(req, res, next, tempName).then(() => {
        if (res.statusCode == 201) {
          const finalPath = "uploads/" + tempName;
          fs.rename(tempPath, finalPath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        } else {
          fs.unlink(tempPath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      });
    } catch (error) {
      console.log(error)
      return res.status(400).json({ Error: error.message });
    }
  }
);

// Update item image
router.post("/imagen", upload.none(), imagenItem);

router.get("/obtener", upload.none(), obtenerItems);

// Editar item
router.put(
  "/editar",
  uploadMiddleware,
  [
    check("categoria", "Debe ingresar una categoría").not().isEmpty(),
    check("nombre", "Debe ingresar un nombre").not().isEmpty(),
    check("descripcion", "Debe ingresar una descripción").not().isEmpty(),
    check("cantidad", "Debe ingresar una cantidad").not().isEmpty(),
    check("precio", "Debe ingresar un precio ").not().isEmpty(),
  ],
  (req, res, next) => {
    const tempName = req.file ? "item" + "-" + Date.now() + "." + req.file.mimetype.replace("image/", "") : null;

    editarItem(req, res, next, tempName).then(() => {
      if (req.file) {
        if (res.statusCode == 200) {
          const finalPath = "uploads/" + tempName;
          fs.rename(req.file.path, finalPath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        } else {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      }
    });
  }
);
export default router;
