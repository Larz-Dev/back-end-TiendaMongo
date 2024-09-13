import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const RolSchema = new mongoose.Schema({
  ID_Rol: {
    type: Number,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
  },
});

RolSchema.plugin(AutoIncrement, { inc_field: "ID_Rol", model: "Rol" });

const Rol = mongoose.model("Rol", RolSchema);

export default Rol;
