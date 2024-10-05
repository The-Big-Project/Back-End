/** @format */

import refreshTokenModel from "../models/refreshTokenModel";

export default async function rotateRefreshToken(
  userId: string | number,
  newToken: string,
  token: string
): Promise<void> {
  try {
    const deletedToken = await refreshTokenModel.findOneAndDelete({
      refreshToken: token,
    });
    if (!deletedToken)
      throw new Error("Rotation Error | No previous refresh token");
    await refreshTokenModel.create({
      userId,
      refreshToken: newToken,
      state: "active",
    });
  } catch (e) {
    if (e instanceof Error) console.log("Error | Rotation Error \n", e.message);
    // throw new Error("Rotation Error | Failed to rotate the refresh token");
  }
}
