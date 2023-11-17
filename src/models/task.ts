import mongoose from "mongoose";
import { Document, Types } from 'mongoose';
import { IEpic } from "./epic";
import { IProject } from "./project";
import { IResource } from "./resource";

// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;


export interface ITask extends Document {
  title: string;
  userId: string;
  status: "Not Started" | "In Progress" | "Completed";
  assignedTo?: string;
  estimateDaysToFinish?: number;
  deleted: boolean;
  epic: Ref<IEpic>;
  resource: Ref<IResource>;
  project: Ref<IProject>;
  order: number;
}


const TaskSchema = new mongoose.Schema({
  title: {
    type: String, required: true, validate: {
      validator: function (name: string) {
        // Regular expression for title validation contains letters,numbers and - , and it has a max of 40 characters
        return /^[a-zA-Z0-9-]{1,40}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid title!`,
    }
  },
  status: {
    type: String,
    required: true,
    default: "Not Started",
    enum: ["Not Started", "In Progress", "Completed"]
  },
  assignedTo: {
    type: String
  },
  userId: {
    trype: String,
    required: true
  },
  estimateDaysToFinish: {
    type: Number,
    default: 0,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  epic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "epic",
    required: true,
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "resource",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
    required: true,
  },
  order: Number,
});

const Task = mongoose.model<ITask>("task", TaskSchema);
export default Task;
