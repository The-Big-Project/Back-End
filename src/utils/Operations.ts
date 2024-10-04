/** @format */

import type { Model, Query } from "mongoose";

export class Operations {
  query;
  constructor(query: Query<any, any>) {
    this.query = query;
  }

  async load(filter: object) {
    this.query.find(filter);
    return this.query;
  }

  paginate(pageNumber: number, pageSize: number) {
    const skip = pageNumber * pageSize;
    this.query.skip(skip).limit(pageSize);
    return this;
  }
}
