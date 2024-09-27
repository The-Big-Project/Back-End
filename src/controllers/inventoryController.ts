/** @format */
import { type Response, type Request } from "express";
import inventoryModel from "../models/inventoryModel";

export const getAllItems = (req: Request, res: Response): void => {
  res.status(200).json({ status: "success", result: "Hello from the server!" });
};

export const addNewItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newItem = req.body;
    const item = await inventoryModel.create(newItem);
    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (e) {
    if (e instanceof Error)
      // Type narrowing
      res.status(500).json({
        status: "fail",
        message: e.message,
      });
  }
};
