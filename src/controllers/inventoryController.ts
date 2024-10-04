/** @format */
import type { Response, Request, NextFunction } from "express";
import inventoryModel from "../models/inventoryModel";
import CustomError from "../utils/CustomError";
import { Operations } from "../utils/Operations";

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.query.pageSize || !req.query.pageNumber)
      throw new CustomError("Pagination info required", 412, "fail");
    const pageSize = Number(req.query.pageSize);
    const pageNumber = Number(req.query.pageNumber);
    const QueryClass = new Operations(inventoryModel.find());
    QueryClass.paginate(pageNumber, pageSize);
    const result = await QueryClass.query;
    console.log(result);

    res.status(200).json({ status: "success", result });
  } catch (e) {
    if (e instanceof CustomError) next(e);
    else if (e instanceof Error) next({ message: e.message, code: 404 });
  }
};

export const addNewItem = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    if (e instanceof Error) next(new CustomError(e.message, 403, "fail"));
  }
};
