import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { IResource } from "./resource";
import { IProject } from "./project";
import { ITask } from "./task";


// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;


export interface IEpic extends Document {
  title: string;
  status: "Not Started" | "In Progress" | "Completed";
  userId: string;
  deleted: boolean;
  resource: Ref<IResource>;
  project: Ref<IProject>;
  order: number;
  tasks: Ref<ITask>[];
}

const EpicSchema = new mongoose.Schema<IEpic>({
  title: String,

  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
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
  order: Number,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }],
    //add start and end date

});

const Epic = mongoose.model<IEpic>("epic", EpicSchema);
export default Epic;
