import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { IResource } from "./resource";
import { IProject } from "./project";
import { ITask } from "./task";
import { IStatus } from "./status";

// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;

export interface IEpic extends Document {
  title: string;
  status: Ref<IStatus>;
  userId: string;
  deleted: boolean;
  resource: Ref<IResource>;
  project: Ref<IProject>;
  tasks: Ref<ITask>[];
}

const EpicSchema = new mongoose.Schema<IEpic>({
  title: {
    type: String, required: true, 
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "status",
    required: true,
  },
  userId: String,
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "resource",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }],
});

const Epic = mongoose.model<IEpic>("epic", EpicSchema);
export default Epic;
