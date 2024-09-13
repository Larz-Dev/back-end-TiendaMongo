/**
 * Rutas de los usuarios
 * host +api+auth
 */

import express from "express";
const router = express.Router();
import { check, body } from "express-validator";
import {
  login,
  crearNuevo,
  imagenUsuario,
  editarUsuario,
  cambiarEstado,
  obtenerUsuarios,
} from "../controllers/usuario.js";
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
    return cb(null, false, new Error("Error, esta imagen no es compatible"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  dest: "uploads/",
  onError: (err, next) => {
    res.status(400).json({ status: "error", error: err.message });
  },
});

const uploadMiddleware = upload.single("photo");



const uploadErrorMiddleware = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "error",
        mensaje: "El archivo es demasiado grande. El límite es de 5MB.",
      });
    }
  }
  next(err);
};


//login
router.post("/login", upload.none(), login);
router.post(
  "/nuevo",
  uploadMiddleware,uploadErrorMiddleware,
  [
    check("nombres", "Debe ingresar un nombre").not().isEmpty(),
    check("apellidos", "Debe ingresar un apellido").not().isEmpty(),

    check("email", "Debe ingresar un correo").isEmail().not().isEmpty(),
    check(
      "password",
      "La contraseña debe tener almenos 6 carácteres y contener letras y números"
    )
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
      .not()
      .isEmpty(),
  ],
  (req, res, next) => {
    if (!req.file) {
      res
        .status(400)
        .json({
          status: "error",
          mensaje: "el archivo no cumple los requisitos",
        });
    }

    const tempPath = req.file.path;
    const format = req.file.mimetype.replace("image/", "");
    const tempName = req.file.fieldname + "-" + Date.now() + "." + format;

    try {
      // Call the crearNuevo function
      crearNuevo(req, res, next, tempName).then(() => {
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
      return res.status(400).json({ Error: error });
    }
  }
);
router.post("/profile", upload.none(), imagenUsuario);
const editUploadMiddleware = upload.any();

router.put(
  "/editar",
  editUploadMiddleware,
  [
    check("nombres", "Debe ingresar un nombre").not().isEmpty(),
    check("apellidos", "Debe ingresar un apellido").not().isEmpty(),
    check("email", "Debe ingresar un correo").isEmail().not().isEmpty(),
    body("password").custom((value, { req }) => {
      if (value) {
        if (value.length < 6) {
          throw new Error("La contraseña debe tener almenos 6 carácteres");
        }
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(value)) {
          throw new Error("La contraseña debe contener letras y números");
        }
      }
      return true;
    }),
  ],
  (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      editarUsuario(req, res);
    } else {
      const file = req.files[0];
      const tempPath = file.path;
      const format = file.mimetype.replace("image/", "");
      const tempName = file.fieldname + "-" + Date.now() + "." + format;
      console.log(tempName);
      try {
        // Call the crearNuevo function
        editarUsuario(req, res, next, tempName).then(() => {
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
        return res.status(400).json({ Error: error });
      }
    }
  }
);

router.post("/estado", upload.none(), cambiarEstado);

router.get("/obtener", upload.none(), obtenerUsuarios);
export default router;
