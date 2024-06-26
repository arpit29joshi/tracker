import { connect } from "@/dbConfig/dbConfig";
import checkToken from "@/helpers/checkToken";
import Task from "@/models/TaskModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("jwt")?.value || "";
    const userId = checkToken(token);
    if (!userId)
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    const chekUser = await User.findOne({ _id: userId }).select(
      "-password -updatedAt -__v"
    );
    if (!chekUser)
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    const totalTaskCompleted = await Task.find({
      userId: userId,
      isCompleted: true,
    }).select("-password -updatedAt -__v");
    return NextResponse.json({
      message: "User found",
      data: chekUser,
      totalTaskCompleted: totalTaskCompleted?.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
