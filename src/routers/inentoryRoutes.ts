/** @format */

import express, { type Response, type Request } from "express";
import { addNewItem, getItems } from "../controllers/inventoryController";
import verifyJWT from "../middlewares/varifyJWT";

export const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getItems).post(addNewItem);

router.route("/:id");
