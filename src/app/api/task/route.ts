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
    const task = await Task.find({ userId }).select(
      "createdAt title isCompleted userId"
    );
    return NextResponse.json({ task }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const { title } = reqBody;
    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const isTaskExist = await Task.findOne({ title, userId });
    if (isTaskExist) {
      return NextResponse.json(
        { error: "Task already exist" },
        { status: 400 }
      );
    }
    const newTask = new Task({ title, userId });
    await newTask.save();
    return NextResponse.json(
      { message: "Task created successfully", data: newTask },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const { title, id } = reqBody;
    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const isTaskExist = await Task.findOne({ title, userId });
    if (isTaskExist) {
      return NextResponse.json(
        { error: "Task already exist" },
        { status: 400 }
      );
    }
    const task = await Task.findById({ _id: id });
    if (String(task.userId) !== String(userId)) {
      return NextResponse.json({ error: "Task not found" }, { status: 400 });
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id },
      { title },
      { new: true }
    );
    return NextResponse.json(
      { message: "Task updated successfully", data: updatedTask },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
