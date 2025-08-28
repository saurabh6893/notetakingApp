import mongoose, { Schema, Document } from "mongoose";

export interface TaskDoc extends Document {
  text: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema<TaskDoc> = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const TaskModel = mongoose.model<TaskDoc>("Task", TaskSchema);

export interface Task {
  id: string;
  text: string;
}

export const tasks: Task[] = [];
