/** @format */

interface CustomErrorAdapter {
  code: number;
  status: "fail" | "success";
}

export default class CustomError extends Error implements CustomErrorAdapter {
  code: number;
  status: "fail" | "success";
  constructor(message: string, code: number, status: "fail" | "success") {
    super(message);
    this.code = code;
    this.status = status;
  }
}
