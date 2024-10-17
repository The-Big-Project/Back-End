/** @format */

import type { Model, Query } from "mongoose";

export class Operations {
  query;
  model;
  #count: Promise<number>;

  constructor(model: Model<any>) {
    this.model = model;
    this.query = model.find();
    this.#count = model.countDocuments();
  }

  paginate(pageNumber: number, pageSize: number) {
    const skip = pageNumber * pageSize;
    this.query.skip(skip).limit(pageSize);
    return this;
  }

  search(queryValue: string) {
    if (!queryValue) return this;
    const filterObject = {
      $or: [
        { name: { $regex: queryValue, $options: "i" } },
        { barCode: { $regex: queryValue, $options: "i" } },
      ],
    };
    this.query.find(filterObject);
    this.#count = this.model.countDocuments(filterObject);
    return this;
  }

  async getCount() {
    if (!this.#count) throw new Error("No data count found");
    return await this.#count;
  }
}
