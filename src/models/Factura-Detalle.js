import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const DetalleFacturaSchema = new mongoose.Schema(
  {
    ID_Item: {
      type: Number,
      ref: "Inventario",
      required: true,
    },
  
    cantidad: {
      type: Number,
      required: true,
    },
    precio_unitario: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  }
);

const FacturaSchema = new mongoose.Schema(
  {
    codigoFactura: {
      type: String,
      required: true,
    },
    ID_Factura: {
      type: Number,
      unique: true,
    },
    ID_Usuario: {
      type: Number,
      ref: "Usuario",
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    iva: {
      type: Number,
      required: true,
    },
    productos: {
      type: Number,
      required: true,
    },
    detalles: [DetalleFacturaSchema],
  },
  { timestamps: true }
);

FacturaSchema.path("ID_Usuario").validate({
  validator: async function (value) {
    const Categoria = mongoose.model("Usuario");
    const categoriaExists = await Categoria.exists({ ID_Usuario: value });
    return categoriaExists;
  },
  message: "El usuario no existe.",
});
FacturaSchema.plugin(AutoIncrement, { inc_field: 'ID_Factura', model: 'Factura' });

const Factura = mongoose.model("Factura", FacturaSchema);

export default Factura;
