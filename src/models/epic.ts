import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { IResource } from "./resource";
import { IProject } from "./project";
import { ITask } from "./task";

type Ref<T extends Document> = T | Types.ObjectId;

export interface IEpic extends Document {
  title: string;
  userId: string;
  status: "Not Started" | "In Progress" | "Completed";
  deleted: boolean;
  tasks: Ref<ITask>[];
  resource: Ref<IResource>;
  project: Ref<IProject>;
  order: number;
}

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
  order: Number,
});

const Epic = mongoose.model<IEpic>("epic", EpicSchema);
export default Epic;
