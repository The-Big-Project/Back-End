/** @format */

import { type Response, type Request, NextFunction } from "express";
import userModel, { type user } from "../models/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { generateJWTaccess, generateJWTrefresh } from "../utils/generateJWT";
import refreshTokenModel from "../models/refreshTokenModel";
import rotateRefreshToken from "../utils/rotateRefreshToken";
dotenv.config({ path: "./config.env" });
const secret = process.env.SECRET as string;

export const addNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    await userModel.create(user);
    const jwtToken = jwt.sign({ name: user.fname + user.lName }, secret);
    const refreshToken = generateJWTrefresh({
      credential: user.fName + user.lName,
    });
    await refreshTokenModel.create({ refreshToken });
    res
      .status(200)
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json({
        status: "success",
        token: jwtToken,
      });
  } catch (e) {
    if (e instanceof Error) next({ message: e.message, statusCode: 402 });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // const credentials = req.body;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const userDB = (await userModel.findOne({
      $or: [
        {
          email,
        },
        {
          phone,
        },
      ],
    })) as user;

    const validPassword = await bcrypt.compare(password, userDB.password);

    if (!validPassword)
      throw new Error("Credentials Error | The password is not right");

    const user = {
      credential: phone || email,
    };

    const accessToken = generateJWTaccess(user);

    const refreshToken = generateJWTrefresh(user);

    await refreshTokenModel.findOneAndDelete({ userId: userDB.id });
    await refreshTokenModel.create({ refreshToken, userId: userDB.id });

    res
      .status(203)
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json({
        status: "success",
        accessToken,
      });
  } catch (e) {
    if (e instanceof Error) next({ message: e.message, statusCode: 402 });
  }
};

export const refreshUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const email = req.body.email;
    const phone = req.body.phone;

    const userDB = (await userModel.findOne({
      $or: [{ email }, { phone }],
    })) as user;

    const user = {
      credential: phone || email,
    };

    const accessToken = generateJWTaccess(user);
    const refreshToken = generateJWTrefresh(user);

    rotateRefreshToken(userDB.id, refreshToken);

    res
      .status(203)
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json({
        status: "success",
        accessToken,
      });
  } catch (e) {
    if (e instanceof Error) next({ message: e.message, statusCode: 402 });
  }
};
