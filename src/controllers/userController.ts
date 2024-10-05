/** @format */

import { type Response, type Request, NextFunction } from "express";
import userModel, { type user } from "../models/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { generateJWTaccess, generateJWTrefresh } from "../utils/generateJWT";
import refreshTokenModel from "../models/refreshTokenModel";
import rotateRefreshToken from "../utils/rotateRefreshToken";
import CustomError from "../utils/CustomError";
dotenv.config({ path: "./config.env" });
const secret = process.env.SECRET as string;

export const addNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // GETTING THE USER FROM THE REQUEST BODY
    const user: user = req.body;

    // ENCRYPTING THE PASSWORD WITH SALT
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    // SORING THE USER IN THE DATABASE
    const createdUser = await userModel.create(user);

    // GENERATING TOKENS
    const tokenData = {
      credential: user.fName + user.lName,
    };
    const accessToken = generateJWTaccess(tokenData);
    const refreshToken = generateJWTrefresh(tokenData);

    // STORING THE REFRESH TOKEN TO THE DATABASE
    await refreshTokenModel.create({
      refreshToken,
      state: "active",
      userId: user.id,
    });

    // SENDING THE RESPONSE
    res
      .status(200)
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json({
        status: "success",
        data: createdUser,
        accessToken: accessToken,
      });
  } catch (e) {
    if (e instanceof Error) next(new CustomError(e.message, 403, "fail"));
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
    if (e instanceof Error) next(new CustomError(e.message, 401, "fail"));
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

    const auth = req.headers?.authorization;

    //The old refresh token
    const token = auth?.split(" ").at(1); //Because the token starts with "Bearer TOKEN"
    if (!token) throw new Error("No Token | There is no token");
    jwt.verify(token, process.env.SECRET as string);

    const accessToken = generateJWTaccess(user);
    const refreshToken = generateJWTrefresh(user);

    rotateRefreshToken(userDB.id, refreshToken, token);

    res
      .status(203)
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json({
        status: "success",
        accessToken,
      });
  } catch (e) {
    if (e instanceof Error) next(new CustomError(e.message, 402, "fail"));
  }
};
