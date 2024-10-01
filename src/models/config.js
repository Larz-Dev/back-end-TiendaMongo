import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    // cadena de conexion con usuario y contraseña
    const uri = "mongodb+srv://larzgit:V4DIEt8lGca6I2st@cluster0.n3zoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  //mongodb+srv://larzgit:V4DIEt8lGca6I2st@cluster0.n3zoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // process.exit(1);
  }
};

export default conectarDB;