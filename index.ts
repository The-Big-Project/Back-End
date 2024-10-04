/** @format */

import { NextFunction, type Request, type Response } from "express";
import dotenv from "dotenv";
import app from "./server";
import CustomError from "./src/utils/CustomError";
import "./scriptINVENTORYITEMS";

dotenv.config({ path: "./config.env" });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.code).json({
    status: err.status,
    message: err.message,
  });
});
