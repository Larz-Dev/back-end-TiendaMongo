import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const InventarioSchema = new mongoose.Schema({
  ID_Item: {
    type: Number,
    unique: true,
  },
  ID_Categoria: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
});
InventarioSchema.plugin(AutoIncrement, {
  inc_field: "ID_Item",
  model: "Inventario",
});


InventarioSchema.path("ID_Categoria").validate({
  validator: async function (value) {
    const Categoria = mongoose.model("Categoria");
    const categoriaExists = await Categoria.exists({ ID_Categoria: value });
    return categoriaExists;
  },
  message: "La categoría seleccionada no existe",
});

const Inventario = mongoose.model("Inventario", InventarioSchema);

export default Inventario;
