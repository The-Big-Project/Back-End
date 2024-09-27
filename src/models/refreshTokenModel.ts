/** @format */

import { model, Schema } from "mongoose";

type refreshToken = {
  userId: string;
  refreshToken: string;
  state: "active" | "broken";
};

const refreshTokenSchema = new Schema<refreshToken>({
  userId: { type: String, unique: true },
  refreshToken: {
    type: String,
    required: [true, "No Token | Can not store a token without a token"],
  },
  state: { type: String, enum: ["active", "broken"], default: "active" },
});

const refreshTokenModel = model<refreshToken>(
  "refreshToken",
  refreshTokenSchema
);

export default refreshTokenModel;
