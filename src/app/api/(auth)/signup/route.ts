import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "@/helpers/generateToken";
connect();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, email, password } = body;
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User (Email) already exists" },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();
    const response = NextResponse.json(
      { msg: "User created successfully", success: true },
      { status: 201 }
    );
    await generateTokenAndSetCookie(newUser._id, response);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
