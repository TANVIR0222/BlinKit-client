import UserModel from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadeImageCloudinary from "../utils/uploadeImageCloudinary.js";
import genaateOTP from "../utils/genaateOTP.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplet.js";
import jwt from "jsonwebtoken";

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

    const user = await UserModel.findOne({ email })

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

    // 
    const updateUpser = await UserModel.findByIdAndUpdate(user._id,{
      last_login_date: new Date()
    })

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
      user: {
        _id: user._id,
      },
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
    const userid = req.userId;

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookieOption);
    res.clearCookie("refreshToken", cookieOption);

    // removeRefreshToken form data base
    await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

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
};

//

export const uploadeAvater = async (req, res) => {
  try {
    const userid = req.params.id; //auth middleware
    const image = req.file; //milter middleware

    console.log(userid,image , "tanvir"  , req.file);
    

    // console.log(userid,'+' , image, "tanvr");

    const upload = await uploadeImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userid, {
      avatar: upload.url,
    });

    return res.status(201).json({
      msg: "image uploaded successfully",
      error: false,
      success: true,
      data: {
        _id: userid,
        avatar: upload.url,
      },
    });
  } catch (error) {
    console.log(error, "ok");

    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

//
export const updateUseDeatils = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, password, number } = req.body;

    let hashPass = "";

    if (password) {
      hashPass = await bcryptjs.hashSync(password, 10);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(number && { number: number }),
        ...(password && { password: hashPass }),
      }
    );

    return res.status(201).json({
      msg: "Update user successfully",
      data: updateUser,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;    
    const user = await UserModel.findOne({ email });

    if (!user) throw new Error("Please register first");

    const otp = genaateOTP();
    const expireTime = new Date() + 60 * 60 * 1000; // 1hr -> 60 * 60 * 1000 count milisecond

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toUTCString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Reset Password",
      html: forgotPasswordTemplate({ name: user.name, otp: otp }),
    });

    return res.status(201).json({
      msg: "Check your email",
      // data: update,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: error.message || error , error: true, success: false });
  }
};

//
export const forgotPasswordOtpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) throw new Error("Please fill in all fields");

    //
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Please register first");

    //
    const currentTime = new Date().toUTCString();
    if (user.forgot_password_expiry < currentTime) {
      return res
        .status(404)
        .json({ msg: "OTP is expired", error: true, success: false });
    }

    //
    if (otp !== user.forgot_password_otp) {
      return res
        .status(404)
        .json({ msg: "Invalid OTP", error: true, success: false });
    }

    // update otp and expiry date update sb kaj she howyar pr data delete 
    const updateOtp = await UserModel.findByIdAndUpdate(user?._id , {
      forgot_password_otp : "",
      forgot_password_expiry : "",
    })

    return res
      .status(200)
      .json({ msg: "Verify SuccessFull ", error: false, success: true });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

//

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    //
    if (
      [email, newPassword, confirmPassword].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new Error("Please fill in all fields");
    }

    //
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Please register first");

    //
    if (newPassword !== confirmPassword) {
      return res.status(404).json({
        msg: "Password not match , try agin ",
        error: true,
        success: false,
      });
    }

    //
    const hasshPass = await bcryptjs.hashSync(newPassword, 10);

    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hasshPass,
    });

    return res.status(200).json({
      msg: "Update password successfull ",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(404).json({
        msg: "Unathorization access",
        error: true,
        success: false,
      });
    }

    // console.log(refreshToken , 'dkjfdfkjhk');
    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECERET_KEY_REFRESH_TOKEN
    );
    if (!verifyToken) {
      return res.status(404).json({
        msg: "Token is expired",
        error: true,
        success: false,
      });
    }

    // console.log(verifyToken._id);
    const userId = verifyToken?._id;

    const newAccessToken = await generateAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", newAccessToken, cookiesOption);

    return res.json({
      message: "New Access token generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.log(error);
    
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};


export const  getSingleUser = async(req,res) => {
  try {
    const { id } = req.params ;

    if(!id){
      res.status(400).json({
        message : "provide category id",
        error : true,
        success : false
      })
    }

    const user = await UserModel.findById(id)

    return res.status(201).json(user);
  } catch (error) {
     res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
}