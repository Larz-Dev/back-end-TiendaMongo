import Rol from "../models/Rol.js";
import { validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
// Crear un nuevo rol
export const crearRol = async (req, res) => {
  const { nombre, descripcion } = req.body;

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }

  const nuevoRol = new Rol({
    ID: undefined,
    nombre,
    descripcion,
  });

  try {
    await nuevoRol.save();
    res.status(201).send({
      status: "success",
      mensaje: "Rol creado exitosamente",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al crear el rol",
      error,
    });
  }
};

// Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.find();

    if (roles != "") {
      res.status(200).send({
        status: "success",
        data: roles,
      });
    } else {
      res.status(500).send({
        status: "error",
        mensaje: "No hay roles, intente de nuevo",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al obtener los roles",
      error,
    });
  }
};

// Actualizar un rol
export const actualizarRol = async (req, res) => {

  const { id, nombre, descripcion } = req.body;

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }

  try {
    const rolActualizado = await Rol.findOneAndUpdate(
      { ID_Rol: id },
      { nombre, descripcion },
      { new: true }
    );

    if (!rolActualizado) {
      return res.status(404).send({
        status: "error",
        mensaje: "Rol no encontrado",
      });
    }

    res.status(200).send({
      status: "success",
      mensaje: "Rol actualizado exitosamente",
      data: rolActualizado,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al actualizar el rol",
      error:error.message,
    });
  }
};

// Eliminar un rol
// Eliminar un rol
export const eliminarRol = async (req, res) => {
  const { id } = req.body;

  try {
    // Check if any Usuario is using the role
    const usuario = await Usuario.findOne({ ID_Rol: id });

    if (usuario) {
      // If a Usuario is found, do not delete the role
      res.status(500).send({
        status: "error",
        mensaje: "Este rol ya pertenece a un usuario, no es posible eliminar",
      });
    } else {
      // If no Usuario is found, delete the role
      const rolEliminado = await Rol.findOneAndDelete({ ID_Rol: id });

      if (!rolEliminado) {
        return res.status(404).send({
          status: "error",
          mensaje: "Rol no encontrado",
        });
      } else {
        res.status(200).send({
          status: "success",
          mensaje: "Rol eliminado exitosamente",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      mensaje: "Error al eliminar el rol",
      error: error.message,
    });
  }
};