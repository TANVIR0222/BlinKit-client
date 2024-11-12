import UserModel from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim() === "")) {
      throw new Error("Please fill in all fields");
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      throw new Error("User all ready register");
    }

    const hasshPass = await bcryptjs.hashSync(password, 10);

    const payload = {
      name,
      email,
      password: hasshPass,
    };

    const newUser = await UserModel(payload);
    await newUser.save();

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser?._id}`;

    await sendEmail({
      sendTo: email,
      subject: "Verify email from binkeyit",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    return res.status(201).json({
      msg: "User Create Success",
      error: false,
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = red.body;

    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User not found", error: true, success: false });
    }

    const verifyuser = await UserModel.updateOne(
      { _id: code },
      { verify_email: true }
    );
    return res.status(201).json({
      msg: "User verify success",
      error: false,
      success: true,
      verifyuser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ msg: "User not register", error: true, success: false });
    }

    // cheack user status
    if (user.status !== "Active") {
      return res
        .status(404)
        .json({ msg: "User not register", error: true, success: false });
    }

    // bcryptjs
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ msg: "Invalid password", error: true, success: false });
    }

    // generate token user verify
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);

    return res.status(201).json({
      msg: "Login success",
      error: false,
      success: true,
      user,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const logoutUser = async (req, res) => {

  try {

    const userid = req.userId
    

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    
    res.clearCookie('accessToken', cookieOption)
    res.clearCookie('refreshToken', cookieOption)

    // removeRefreshToken form data base 
    await UserModel.findByIdAndUpdate(userid , {
      refresh_token: ""
    })

    return res.status(201).json({
      msg: "Logout success",
      error: false,
      success: true,
    });

  } catch (error) {
    return res
    .status(500)
    .json({ msg: error.message || error, error: true, success: false });
  }

}


