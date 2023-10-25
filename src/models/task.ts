import mongoose from "mongoose";
import { ITask } from "./types";

const TaskSchema = new mongoose.Schema({
  title: String,
  status: String,
  userId: String,
  estimateDaysToFinish: Number,
  deleted: {
    type: Boolean,
    default: false,
  },
  epic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "epic",
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "resource",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  order: Number,
});

const Task = mongoose.model<ITask>("task", TaskSchema);
export default Task;
