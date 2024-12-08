import { Router } from "express";
import {
  forgotPassword,
  forgotPasswordOtpVerify,
  loginUser,
  logoutUser,
  refreshToken,
  register,
  resetPassword,
  updateUseDeatils,
  uploadeAvater,
  verifyEmail,
} from "../controller/user.controller.js";
import auth from "../middleware/aurh.middleware.js";
import uploade from "../middleware/multer.js";

const userRoute = Router();

userRoute.post("/register", register);
userRoute.post("/verifyEmail", verifyEmail);
userRoute.post("/login", loginUser);
userRoute.post("/logout", logoutUser);
userRoute.put("/uploade-image/:id", uploade.single("avatar"), uploadeAvater);
userRoute.put("/uploade-user", auth, updateUseDeatils);
userRoute.put("/forgot-password", forgotPassword);
userRoute.put("/verify-forgoot-password-otp", forgotPasswordOtpVerify);
userRoute.put("/rest-password", resetPassword);
userRoute.post("/refresh-Token", refreshToken);

export default userRoute;
