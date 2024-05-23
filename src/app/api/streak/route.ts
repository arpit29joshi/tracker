import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Task from "@/models/TaskModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function PUT(request: NextRequest) {
  try {
    // 1. Update user streaks
    const users = await User.find();
    for (const user of users) {
      if (user.isAllTasksCompleted) {
        user.currentStreak += 1;
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
      } else {
        user.currentStreak = 0;
      }
      user.isAllTasksCompleted = false; // Reset the flag for the next day
      await user.save();
    }

    // 2. Reset all tasks
    await Task.updateMany({}, { isCompleted: false });

    return NextResponse.json(
      {
        message: "Daily task completed successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in API call: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import Task from "@/models/TaskModel";
// import { NextRequest, NextResponse } from "next/server";
// connect();

// export async function GET(request: NextRequest) {
//   console.log("api call");
//   try {
//     // 1. Update user streaks
//     const users = await User.find();
//     for (const user of users) {
//       if (user.isAllTasksCompleted) {
//         user.currentStreak += 1;
//         if (user.currentStreak > user.longestStreak) {
//           user.longestStreak = user.currentStreak;
//         }
//       } else {
//         user.currentStreak = 0;
//       }
//       user.isAllTasksCompleted = false; // Reset the flag for the next day
//       await user.save();
//     }

//     // 2. Reset all tasks
//     await Task.updateMany({}, { isCompleted: false });
//     const newTask = await Task.find({});

//     console.log("Daily task completed successfully.");
//     return NextResponse.json(
//       {
//         message: "Daily task completed successfully.",
//         data: { newTask, users },
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
