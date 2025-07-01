import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

//DUDA
const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const;
// as const es usado para que el objeto sea tratado como un tipo literal, lo que permite que los valores sean utilizados como tipos en TypeScript.
// Esto significa que los valores de taskStatus son tratados como tipos literales en lugar de strings genéricos.

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[];
  notes: Types.ObjectId[];
}

export const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    project: {
      type: Types.ObjectId,
      ref: "Project",
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null,
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],
    notes: [
      {
        type: Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);
//Middleware
TaskSchema.pre("deleteOne", { document: true }, async function () {
  const taskId = this._id;
  if (!taskId) return await Note.deleteMany({ task: taskId });
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
