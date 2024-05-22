import { connect } from "@/dbConfig/dbConfig";
import checkToken from "@/helpers/checkToken";
import User from "@/models/userModel";
import Task from "@/models/TaskModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function PUT(request: NextRequest) {
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
    const reqBody = await request.json();
    const { id } = reqBody;

    const task = await Task.findById({ _id: id });
    if (String(task.userId) !== String(userId)) {
      return NextResponse.json({ error: "Task not found" }, { status: 400 });
    }

    await Task.findByIdAndUpdate(id, {
      isCompleted: !task.isCompleted,
    });
    return NextResponse.json(
      { message: "Task updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
