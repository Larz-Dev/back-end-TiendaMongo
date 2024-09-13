import Categoria from "../models/Categoria.js";
import { validationResult } from "express-validator";
import Inventario from "../models/Inventario.js";

// Crear una nueva categoria
export const crearCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }

  const nuevaCategoria = new Categoria({
    ID: undefined,
    nombre,
    descripcion,
  });

  try {
    await nuevaCategoria.save();
    res.status(201).send({
      status: "success",
      mensaje: "Categoria creada exitosamente",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al crear la categoria",
      error,
    });
  }
};

// Obtener todas las categorias
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();

    if (categorias != "") {
      res.status(200).send({
        status: "success",
        data: categorias,
      });
    } else {
      res.status(500).send({
        status: "error",
        mensaje: "No hay categorias, intente de nuevo",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al obtener las categorias",
      error,
    });
  }
};

// Actualizar una categoria
export const actualizarCategoria = async (req, res) => {

  const { id, nombre, descripcion } = req.body;

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }

  try {
    const categoriaActualizada = await Categoria.findOneAndUpdate(
      { ID_Categoria: id },
      { nombre, descripcion },
      { new: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).send({
        status: "error",
        mensaje: "Categoria no encontrada",
      });
    }

    res.status(200).send({
      status: "success",
      mensaje: "Categoria actualizada exitosamente",
      data: categoriaActualizada,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al actualizar la categoria",
      error,
    });
  }
};
// Eliminar una categoria
export const eliminarCategoria = async (req, res) => {
  const { id } = req.body;

  try {
    const producto = await Inventario.findOne({ ID_Categoria: id }); 

    if (producto) {
      // If a product is found, do not delete the category
      res.status(500).send({
        status: "error",
        mensaje: "Esta categoria ya pertenece a un producto, no es posible eliminar",
      });
    } else {
      // If no product is found, delete the category
      const categoriaEliminada = await Categoria.findOneAndDelete({ ID_Categoria: id });

      if (!categoriaEliminada) {
        return res.status(404).send({
          status: "error",
          mensaje: "Categoria no encontrada",
        });
      } else { 
        res.status(200).send({
          status: "success",
          mensaje: "Categoria eliminada exitosamente",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      mensaje: "Error al eliminar la categoria",
      error: error.message,
    });
  }
};