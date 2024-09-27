/** @format */

import express, { type Response, type Request } from "express";
import verifyJWT from "../middlewares/varifyJWT";
import {
  addNewUser,
  loginUser,
  refreshUser,
} from "../controllers/userController";

export const router = express.Router();

router.route("/signup").post(addNewUser);

router.route("/login").post(loginUser);

router.route("/refresh").get(refreshUser);
