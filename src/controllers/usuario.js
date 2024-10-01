import Usuario from "../models/Usuario.js";
import Rol from "../models/Rol.js";
import fs from "fs";
//import express from "express"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { password, email } = req.body;

  const query = Usuario.findOne({ email: email });

  query.select("email");
  query.select("estado");
  query.select("password");
  query.select("nombres");
  query.select("apellidos");
  query.select("ID_Rol");
  query.select("ID_Usuario");

  const cuenta = await query.exec();

  
  if (cuenta == null) {
    return res.send({
      status: "error",
      mensaje: "correo inválido",
    });
  }
  else if (cuenta.estado == 0) {
    return res.send({
      status: "error",
      mensaje: "cuenta inactiva",
    })}
    else {
    const rol = await Rol.findOne({ ID_Rol: cuenta.ID_Rol }).select("nombre");

    if ((await bcrypt.compare(password, cuenta.password)) == true) {
      return res.send({
        status: "success",
        email: email,
        nombres: cuenta.nombres,
        apellidos: cuenta.apellidos,
        id: cuenta.ID_Usuario,
        rol: cuenta.ID_Rol,
        rolname: rol.nombre,

        mensaje: "Ingreso existoso",
      });
    } else {
      return res.send({
        status: "error",
        mensaje: "Correo o contraseña inválidos",
      });
    }
  }
};
export const crearNuevo = async (req, res, next, tempName) => {
  let salt = 12;

  const { nombres, apellidos, email, password,} = req.body;
  console.log(req.body);
  try {
  } catch (error) {}
  let val = bcrypt.hashSync(password, salt);
  let datos = {
    nombres: nombres,
    apellidos: apellidos,
    password: val,
    email: email,
    foto: tempName,
    ID_Rol: 1,

  };
console.log(datos)
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).send({
      status: "errors",
      errors: errores.mapped(),
    });
  }
  const usuario = new Usuario(datos);
  try {
    await usuario.save();
    res.status(201).send({
      status: "success",
      mensaje: "Registro Exitoso",
    });
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      res.status(500).send({
        status: "error",
        mensaje: "Este correo ya se encuentra en uso",
      });
    } else {
      res.status(500).send({
        status: "error",
        mensaje: "Error al registrar usuario",
        error,
      });
    }
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const usuario = await Usuario.findOne({ ID_Usuario: id });

    if (usuario) {
      const estadoActual = usuario.estado;
      const nuevoEstado = estadoActual === 0 ? 1 : 0;
      usuario.estado = nuevoEstado;
      await usuario.save();
      res.status(200).send({
        status: "success",
        mensaje: "Se ha actualizado el estado exitosamente",
      });
    } else {
      res.status(404).send({
        status: "error",
        mensaje: "Registro no encontrado",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      mensaje: "Error al cambiar el estado: " + error,
    });
  }
};

export const imagenUsuario = async (req, res) => {
  try {
    const { id } = req.body;
    let Error = "";
    console.log(id);
    const usuario = await Usuario.findOne({ ID_Usuario: id });

    if (usuario) {
      const imagePath = "uploads/" + usuario.foto;
      fs.readFile(imagePath, (err, data) => {
        if (data) {
          res.writeHead(200, { "Content-Type": "image/png" });
          res.end(data);
        } else {
          fs.readFile("./src/public/ProfileLoading.gif", (err, data) => {
            console.error(err);
            res.end(data);
          });
        }
      });
    } else {
      res.status(200).send({
        status: "error",
        mensaje: "Datos incorrectos, verifique e intente de nuevo",
      });
    }
  } catch (error) {
    res.status(200).send({
      status: "error",
      mensaje: "No se han encontrado datos, intente de nuevo",
    });
  }
};
export const editarUsuario = async (req, res, none, tempName) => {
  const { id, nombres, apellidos, email, password, ID_Rol, estado } = req.body;

  try {
    const usuario = await Usuario.findOne({ ID_Usuario: id });

    if (!usuario) {
      return res.status(404).send({
        status: "error",
        mensaje: "Usuario no encontrado",
      });
    }

    // Handle image upload

   
    usuario.nombres = nombres;
    usuario.apellidos = apellidos;
    usuario.email = email;
 
    usuario.ID_Rol = ID_Rol;
    if (tempName !== null && tempName !== undefined) {
      usuario.photo = tempName;
    }
    if (password) {
      let salt = 12;
      let val = bcrypt.hashSync(password, salt);
      usuario.password = val;
    }
    usuario.estado = estado;
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).send({
        status: "errors",
        errors: errores.mapped(),
      });
    }

    try {
      await usuario.save();
      res.status(201).send({
        status: "success",
        mensaje: "Usuario actualizado exitosamente",
      });
    } catch (error) {
      if (error.name === "MongoServerError" && error.code === 11000) {
        res.status(500).send({
          status: "error",
          mensaje: "Este correo ya se encuentra en uso",
        });
      } else {
        res.status(500).send({
          status: "error",
          mensaje: "Error al actualizar usuario",
          error,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      mensaje: "Error al actualizar usuario",
      error:error.message
    });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    // Busca todos los usuarios en la base de datos.
    const usuarios = await Usuario.find()
      .select("nombres apellidos email ID_Usuario ID_Rol estado")
      .exec();

    // Si no hay usuarios, devuelve un mensaje de error.
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).send({
        status: "error",
        mensaje: "No se han encontrado usuarios",
      });
    }

    // Agrega el nombre del rol a cada usuario
    const usuariosConRol = await Promise.all(
      usuarios.map(async (usuario) => {
        const rol = await Rol.findOne({ ID_Rol: usuario.ID_Rol })
          .select("nombre")
          .exec();
        return { ...usuario.toObject(), rol: rol.nombre };
      })
    );

    // Devuelve la lista de usuarios con el nombre del rol.
    res.status(200).send({
      status: "success",
      usuarios: usuariosConRol,
    });
  } catch (error) {
    // Si ocurre un error, devuelve un mensaje de error.
    res.status(500).send({
      status: "error",
      mensaje: "Error al obtener usuarios",
      error,
    });
  }
};
