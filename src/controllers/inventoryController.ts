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
    const searchQuery = req.query.search || "";
    const QueryClass = new Operations(inventoryModel);
    QueryClass.search(searchQuery as string).paginate(
      pageNumber || 0,
      pageSize || 12
    );

    const data = await QueryClass.query;
    const resultCount = await QueryClass.getCount();

    res
      .status(200)
      .json({ status: "success", count: resultCount, result: data });
  } catch (e) {
    console.error(e);
    if (e instanceof CustomError) next(e);
    else if (e instanceof Error)
      next({ message: "Internal server error", code: 400 });
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
