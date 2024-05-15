import mongoose from "mongoose";

const taskSchem = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Task = mongoose.models.tasks || mongoose.model("tasks", taskSchem);
export default Task;
