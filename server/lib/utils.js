import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure:false,
  });

  return token;
};
