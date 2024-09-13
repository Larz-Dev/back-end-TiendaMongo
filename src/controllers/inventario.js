import Inventario from "../models/Inventario.js";
import { validationResult } from "express-validator";

import fs from "fs";
import Categoria from "../models/Categoria.js";
// Crear un nuevo ítem en el inventario
export const crearItem = async (req, res, none, tempName) => {
  const { ID_Categoria, nombre, descripcion, cantidad, precio } = req.body;

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }

  const nuevoItem = new Inventario({
    ID_Categoria,
    nombre,
    descripcion,
    cantidad,
    precio,
    photo: tempName, // add the photo field
  });

  try {
    await nuevoItem.save();
    res.status(201).send({
      status: "success",
      mensaje: "Ítem creado exitosamente",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al crear el ítem",
      error,
    });
  }
};
// Obtener todos los ítems del inventario

export const imagenItem = async (req, res) => {
  try {
    const { id } = req.body;
    let Error = "";

    const item = await Inventario.findOne({ ID_Item: id });
    console.log(item);
    if (item) {
      const imagePath = "uploads/" + item.photo;
      console.log(imagePath);
      fs.readFile(imagePath, (err, data) => {
        if (data) {
          res.writeHead(201, { "Content-Type": "image/png" });
          res.end(data);
        } else {
          fs.readFile("./src/public/PostLoading.gif", (err, data) => {
            console.error(err);
            res.end(data);
          });
        }
      });
    } else {
      res.status(400).send({
        status: "error",
        mensaje: "Datos incorrectos, verifique e intente de nuevo",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      mensaje: "Datos incorrectos, verifique e intente de nuevo",
    });
  }
};
export const obtenerItems = async (req, res) => {
  try {
    const items = await Inventario.find();
    const data = await Promise.all(
      items.map(async (item) => {
        const categoria = await Categoria.findOne({ ID_Categoria: item.ID_Categoria }).select("nombre");
        return {
          ...item.toObject(),
          categoria: categoria.nombre,
        };
      })
    );
    console.log(data);
    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      mensaje: "Error al obtener los ítems",
    });
  }
};

// Actualizar un ítem del inventario

export const editarItem = async (req, res, none, tempName) => {
  const { categoria, nombre, descripcion, cantidad, id, precio } = req.body;
  console.log(req.body);
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }

  try {
    const item = await Inventario.findOne({ ID_Item: id });

    if (!item) {
      return res.status(404).send({
        status: "error",
        mensaje: "Ítem no encontrado",
      });
    }

    item.ID_Categoria = categoria;
    item.nombre = nombre;
    item.descripcion = descripcion;
    item.cantidad = cantidad;
    item.precio = precio;

    // Only update the photo field if tempName is not null or undefined
    if (tempName !== null && tempName !== undefined) {
      item.photo = tempName;
    }

    await item.save();
    res.status(200).send({
      status: "success",
      mensaje: "Ítem actualizado exitosamente",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      status: "error",
      mensaje: "Error al actualizar el ítem",
      error: error.message,
    });
  }
};
