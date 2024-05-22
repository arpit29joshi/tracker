import { connect } from "@/dbConfig/dbConfig";
import checkToken from "@/helpers/checkToken";
import User from "@/models/userModel";
import Task from "@/models/TaskModel";
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
    const chekUser = await User.findOne({ _id: userId });
    if (!chekUser)
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    const allTask = await Task.find({ userId: userId });
    // if all task is complete
    const completeTask = await Task.find({ userId: userId, isCompleted: true });
    console.log(completeTask.length, allTask.length);
    if (completeTask.length === allTask.length) {
      await User.findByIdAndUpdate(userId, {
        isAllTasksCompleted: true,
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        isAllTasksCompleted: false,
      });
    }
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
