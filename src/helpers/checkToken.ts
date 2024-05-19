import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const checkToken = (token: string) => {
  let decode;
  try {
    console.log(token);
    decode = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("decode", decode.userId);
  } catch (error) {
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
  console.log(decode);
};
export default checkToken;
