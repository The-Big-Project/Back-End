/** @format */

import jwt, { type Jwt } from "jsonwebtoken";

type userData = {
  credential: string;
};
export function generateJWTaccess(user: userData): string {
  const accessToken = jwt.sign(user, process.env.SECRET as string, {
    expiresIn: "30m",
  });
  return accessToken;
}

export function generateJWTrefresh(user: userData) {
  const refreshToken = jwt.sign(user, process.env.SECRET2 as string, {
    expiresIn: "3 days",
  });
  return refreshToken;
}
