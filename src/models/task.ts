import mongoose from "mongoose";
import { Document, Types } from 'mongoose';
import { IEpic } from "./epic";
import { IProject } from "./project";
import { IResource } from "./resource";
import { IStatus } from "./status";

// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;

export interface ITask extends Document {
  title: string;
  description: string;
  socialImpact: boolean;
  environmentalImpact: boolean
  userId: string;
  status: Ref<IStatus>;
  assignedTo?: string;
  estimateDaysToFinish?: number;
  startDate: Date;
  endDate: Date;
  deleted: boolean;
  epic: Ref<IEpic>;
  resource: Ref<IResource>;
  project: Ref<IProject>;
}

const TaskSchema = new mongoose.Schema({
  title: {
    type: String, required: true, validate: {
      validator: function (name: string) {
        return /^[a-zA-Z0-9-,\s./]{1,250}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid title!`,
    }
  },
  description: {
    type: String, validate: {
      validator: function (name: string) {
        return /^[a-zA-Z0-9-,\s./]{1,350}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid description!`,
    }
  },
  socialImpact: {
    type: Boolean,
    default: false,
    required: true,
  },
  environmentalImpact: {
    type: Boolean,
    default: false,
    required: true,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "status",
    required: true
  },
  assignedTo: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  estimateDaysToFinish: {
    type: Number,
    default: 0,
    required: true
  },
  startDate: {
    type: Date,
    default: null,
    required: false
  },
  endDate: {
    type: Date,
    default: null,
    required: false
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
});

const Task = mongoose.model<ITask>("task", TaskSchema);
export default Task;
