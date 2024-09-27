/** @format */

import { NextFunction, type Request, type Response } from "express";
import dotenv from "dotenv";
import app from "./server";

dotenv.config({ path: "./config.env" });

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express + TypeScript");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "failed",
    message: err.message,
  });
});
