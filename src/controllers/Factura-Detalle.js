import Factura from "../models/Factura-Detalle.js";
import Usuario from "../models/Usuario.js";
import { validationResult } from "express-validator";
import Inventario from "../models/Inventario.js";

// Crear una nueva factura
export const crearFactura = async (req, res) => {
  const { ID_Usuario, fecha, total, detalles, codigoFactura, iva, productos } =
    req.body;

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }

  try {
    // Check if the products are in stock
    for (const detalle of detalles) {
      const inventario = await Inventario.findOne({ ID_Item: detalle.ID_Item });
      if (!inventario) {
        throw new Error(`No se encontró el producto con ID_Item ${detalle.ID_Item}`);
      }
      const cantidadActual = inventario.cantidad;
      console.log(`Cantidad actual del producto ${detalle.ID_Item}: ${cantidadActual}`);
      const nuevaCantidad = cantidadActual - detalle.cantidad;
      if (nuevaCantidad < 0) {
        throw new Error(`No hay suficiente stock del producto ${detalle.ID_Item}`);
      }
      await Inventario.updateOne(
        { ID_Item: detalle.ID_Item },
        { $set: { cantidad: nuevaCantidad } }
      );
      console.log(`Cantidad actualizada del producto ${detalle.ID_Item}: ${nuevaCantidad}`);
    }

    const nuevaFactura = new Factura({
      ID_Usuario,
      fecha,
      total,
      detalles,
      codigoFactura,
      iva,
      productos,
    });

    await nuevaFactura.save();

    // Update the cantidad of the item in the Inventario model
    
    res.status(201).send({
      status: "success",
      mensaje: "Factura creada exitosamente",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al crear la factura:" + error.message,
    });
  }
};

// Obtener todas las facturas
export const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find();

    const data = await Promise.all(
      facturas.map(async (factura) => {
        const usuario = await Usuario.findOne({
          ID_Usuario: factura.ID_Usuario,
        });
        return {
          ...factura.toObject(),
          usuario: usuario.nombres + " " + usuario.apellidos,
        };
      })
    );

    res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al obtener las facturas",
      error,
    });
  }
};
// Actualizar una factura
export const actualizarFactura = async (req, res) => {
  const { id } = req.params;
  const { ID_Usuario, fecha, total, detalles } = req.body;

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }

  try {
    const facturaActualizada = await Factura.findByIdAndUpdate(
      id,
      { ID_Usuario, fecha, total, detalles },
      { new: true }
    )
      .populate("ID_Usuario")
      .populate("detalles.ID_producto");

    if (!facturaActualizada) {
      return res.status(404).send({
        status: "error",
        mensaje: "Factura no encontrada",
      });
    }

    res.status(200).send({
      status: "success",
      mensaje: "Factura actualizada exitosamente",
      data: facturaActualizada,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al actualizar la factura",
      error,
    });
  }
};

export const obtenerFacturaCliente = async (req, res) => {
  try {
    const idUsuario = req.body.id; // or however you get the id from the request

    const factura = await Factura.find({ ID_Usuario: idUsuario });

    if (!factura) {
      res.status(404).send({
        status: "error",
        mensaje: "No se encontró la factura del cliente",
      });
    } else {
      res.status(200).send({
        status: "success",
        data: factura,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      status: "error",
      mensaje: "Error al obtener la factura del cliente",
    });
  }
};

// Eliminar una factura
export const eliminarFactura = async (req, res) => {
  const { id } = req.params;

  try {
    const facturaEliminada = await Factura.findByIdAndDelete(id);

    if (!facturaEliminada) {
      return res.status(404).send({
        status: "error",
        mensaje: "Factura no encontrada",
      });
    }

    res.status(200).send({
      status: "success",
      mensaje: "Factura eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al eliminar la factura",
      error,
    });
  }
};
