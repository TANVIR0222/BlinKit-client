import jwt from "jsonwebtoken";
import UserModel from "../model/user.model.js";

const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ _id: userId }, process.env.SECERET_KEY, {
    expiresIn: "7d",
  });

  const updateRefreshTokenUser = await UserModel.findOneAndUpdate({_id: userId} , {refresh_token : token});

  return token;
};

export default generateRefreshToken;
