import mongoose from "mongoose";
import { IEpic } from "./types";

const EpicSchema = new mongoose.Schema<IEpic>({
  title: String,
  status: String,
  userId: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "resource",
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
});

const Epic = mongoose.model<IEpic>("epic", EpicSchema);
export default Epic;
