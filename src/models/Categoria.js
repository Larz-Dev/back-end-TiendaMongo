import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const CategoriaSchema = new mongoose.Schema({
  ID_Categoria: {
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

CategoriaSchema.plugin(AutoIncrement, { inc_field: "ID_Categoria", model: "Categoria" });

const Categoria = mongoose.model("Categoria", CategoriaSchema);

export default Categoria;
