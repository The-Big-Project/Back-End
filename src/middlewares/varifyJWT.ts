/** @format */

import { type Response, type Request, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers?.authorization;
    const token = auth?.split(" ").at(1); //Because the token starts with "Bearer TOKEN"
    if (!token) throw new Error("No Token | There is no token");
    jwt.verify(token, process.env.SECRET as string);
    next();
  } catch (e) {
    if (e instanceof Error)
      res.status(403).json({
        status: "error",
        message: e.message,
      });
  }
}
