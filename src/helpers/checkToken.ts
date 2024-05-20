import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const checkToken = (token: string) => {
  let decode;
  try {
    decode = jwt.verify(token, process.env.TOKEN_SECREST);
  } catch (error) {
    console.log("error", error);
    const response = NextResponse.json(
      { error: "Please login again" },
      { status: 400 }
    );
    response.cookies.set("jwt", "", { httpOnly: true, expires: new Date(0) });
    return response;
  }
  if (!decode) {
    return NextResponse.json(
      { error: "Invalid token. Please login again" },
      { status: 400 }
    );
  }
  return decode.userId;
};
export default checkToken;
