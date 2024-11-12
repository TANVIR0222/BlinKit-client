import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
  const token = jwt.sign({ _id: userId }, process.env.SECERET_KEY, {
    expiresIn: "5h",
  });

  return token;
};

export default generateAccessToken;