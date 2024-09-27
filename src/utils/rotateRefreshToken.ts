/** @format */

import refreshTokenModel from "../models/refreshTokenModel";

export default async function rotateRefreshToken(
  userId: string | number,
  newToken: string
): Promise<void> {
  try {
    await refreshTokenModel.findOneAndDelete({ userId });
    await refreshTokenModel.create({
      userId,
      refreshToken: newToken,
      state: "active",
    });
  } catch (e) {
    throw new Error("Rotation Error | Failed to rotate the refresh token");
  }
}
