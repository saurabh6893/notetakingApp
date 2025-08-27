import mongoose, { Schema, Document } from "mongoose";

export interface TaskDoc extends Document {
  text: string;
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
  },
  {
    timestamps: true,
  },
);

export const TaskModel = mongoose.model<TaskDoc>("Task", TaskSchema);
