import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { NextResponse } from "next/server";

const generateTokenAndSetCookie = (userId: ObjectId, res: NextResponse) => {
  console.log("userId", userId);
  const token = jwt.sign({ userId }, process.env.TOKEN_SECREST!, {
    expiresIn: "3d",
  });
  console.log(token);
  res.cookies.set("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    // secure: process.env.NODE_ENV !== "development",
  });
};
export default generateTokenAndSetCookie;
