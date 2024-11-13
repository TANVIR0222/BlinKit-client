import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {

    const token = req.cookies.accessToken || req?.header?.authorization?.split(" ")[1]
    console.log(token );

    if(!token){
        return response.status(401).json({
            message : "Provide token"
        })
    }
    
    const decode = jwt.verify(token, process.env.SECERET_KEY_ACCESS_TOKEN);
    
    if(!decode){
        return response.status(401).json({
            message : "unauthorized access",
            error : true,
            success : false
        })
    }

    req.userId = decode._id
    
    next();

  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export default auth;