import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Task from "@/models/TaskModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function PUT(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { secretKey } = reqBody;
    console.log("secretKey", secretKey);
    console.log("AUTH_SECRET", process.env.AUTH_SECRET);
    if (!secretKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }
    if (secretKey !== process.env.AUTH_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (secretKey === process.env.AUTH_SECRET) {
      return NextResponse.json(
        {
          message: "Daily task completed successfully.",
        },
        { status: 201 }
      );
      // // 1. Update user streaks
      // const users = await User.find();
      // for (const user of users) {
      //   if (user.isAllTasksCompleted) {
      //     user.currentStreak += 1;
      //     if (user.currentStreak > user.longestStreak) {
      //       user.longestStreak = user.currentStreak;
      //     }
      //   } else {
      //     user.currentStreak = 0;
      //   }
      //   user.isAllTasksCompleted = false; // Reset the flag for the next day
      //   await user.save();
      // }
      // // 2. Reset all tasks
      // await Task.updateMany({}, { isCompleted: false });
      // return NextResponse.json(
      //   {
      //     message: "Daily task completed successfully.",
      //   },
      //   { status: 201 }
      // );
    }
  } catch (error: any) {
    console.error("Error in API call: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
