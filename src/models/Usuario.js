import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const UsuarioSchema = new mongoose.Schema({
  ID_Usuario: {
    type: Number,
    unique: true,
  },
  nombres: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
  },
  estado: {
    type: Number,
    default: 1,
  },

  ID_Rol: {
    type: Number,
    ref: "Rol",
    default:1,
    required: true,
  },
});
UsuarioSchema.path("ID_Rol").validate({
  validator: async function (value) {
    const Rol = mongoose.model("Rol");
    const rolExists = await Rol.exists({ ID_Rol: value });
    return rolExists;
  },
  message: "El rol seleccionado no existe",
});
UsuarioSchema.plugin(AutoIncrement, {
  inc_field: "ID_Usuario",
  model: "Usuario",
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;
