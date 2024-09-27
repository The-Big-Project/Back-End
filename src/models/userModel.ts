/** @format */

import { model, Schema } from "mongoose";

export type user = {
  id: number;
  joinedAt: Date;
  fName: string;
  lName: string;
  dob: Date;
  address: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
  state: "active" | "banned" | "blocked" | "deleted"; //active: working fine, banned: payment issues, blocked: for security purposes, deleted: by a user written request
};

const userSchema = new Schema<user>({
  id: {
    type: Number,
    required: [true, "No ID | You can not create a user without an ID"],
  },
  fName: {
    type: String,
    required: [true, "No fName | The user must have first name"],
  },
  lName: {
    type: String,
    required: [true, "No lName | The user must have last name"],
  },
  joinedAt: { type: Date, default: new Date() },
  email: {
    type: String,
    required: [
      true,
      "No Email | Can not create an account without an email address",
    ],
    validate: {
      validator: function (value: string): boolean {
        return value ? true : this.email ? true : false;
      },
    },
  },
  phone: {
    type: String,
    required: [
      true,
      "No Phone | Can not create an account without a phone number",
    ],
    validate: {
      validator: function (value: string): boolean {
        return value ? true : this.email ? true : false;
      },
    },
  },
  password: {
    type: String,
    required: [
      true,
      "No Password | You can not create a user without a password",
    ],
  },
  role: {
    type: String,
    required: [true, "No Role | You can not create a user without a role"],
  },
  address: String,
  dob: Date,
  // state: {
  //   type: String,
  //   enum: {
  //     values: ["active", "banned", "blocked", "deleted"],
  //     message: "The account type is not right",
  //   },
  // },
});

userSchema.virtual("state");

userSchema.pre("save", function (next): void {
  this.state = "active";
  next();
});

const userModel = model<user>("user", userSchema);

export default userModel;
