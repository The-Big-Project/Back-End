/** @format */

import express, { type NextFunction } from "express";
import { router as inventoryRouter } from "./src/routers/inentoryRoutes";
import { router as userRouter } from "./src/routers/userRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
const DB_PASSWORD = process.env.DATABASE_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://bilalaney084:${DB_PASSWORD}@bigcluster.ugwvf.mongodb.net/?retryWrites=true&w=majority&appName=BigCluster`
  )
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("failed to connect to the database, ERROR", err));

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/inventory", inventoryRouter);
// app.use("/sell");

export default app;
