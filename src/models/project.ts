import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { IEpic } from "./epic";
import { IStatus } from "./status";



// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;

export interface IProject extends Document {
  name: string;
  description?: string;
  prompt?: string;
  userId: string;
  startDate: Date;
  deleted: boolean;
  statuses: Ref<IStatus>[];
  epics: Ref<IEpic>[];
}

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
      },
  prompt: String,
  userId: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  }, epics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "epic",
    },
  ],
  statuses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "status",
    },
  ],
  startDate: {
    type: Date,
    default: null,
    required: false
  },

  //TODO list of status for the project
  // it's an object contains the status name and the status color and order
  // userid and the defualt is system
});

const Project = mongoose.model<IProject>("project", ProjectSchema);
export default Project;
