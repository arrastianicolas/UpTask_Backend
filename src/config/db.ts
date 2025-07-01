import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(colors.bgMagenta.bold(`MongoDB Conectado en: ${url}`));
  } catch (error) {
    console.log(colors.bgRed.bold("Erro al conectar a la DB!"));
    exit(1);
  }
};
