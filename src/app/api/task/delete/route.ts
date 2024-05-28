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
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 400 });
    }
    if (String(task.userId) !== String(userId)) {
      return NextResponse.json({ error: "Task not found" }, { status: 400 });
    }
    const deletedTask = await Task.findByIdAndDelete({ _id: id });
    const user = await User.findById(userId);
    const userTasks = await (await Task.find({ userId })).length;
    const userCompletedTasks = await (
      await Task.find({ userId, isCompleted: true })
    ).length;
    console.log(user.isAllTasksCompleted, userTasks, userCompletedTasks);

    if (!user.isAllTasksCompleted && userCompletedTasks === userTasks) {
      console.log("45");
      user.isAllTasksCompleted = true;
      await user.save();
    }
    if (user.isAllTasksCompleted && userTasks == 0) {
      console.log("40");
      user.isAllTasksCompleted = false;
      await user.save();
    }
    return NextResponse.json(
      { message: "Task deleted successfully", data: deletedTask },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
