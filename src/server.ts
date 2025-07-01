import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { corsConfing } from "./config/cors";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";
dotenv.config();

connectDB();

const app = express();
app.use(cors(corsConfing));

//logging
app.use(morgan("dev"));

//Leer datos de formularios
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;
