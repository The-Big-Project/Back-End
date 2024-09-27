/** @format */

import express, { type Response, type Request } from "express";
import inventoryModel from "../models/inventoryModel";
import { addNewItem, getAllItems } from "../controllers/inventoryController";
import verifyJWT from "../middlewares/varifyJWT";

export const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getAllItems).post(addNewItem);

router.route("/:id");
