import mongoose from "mongoose";
import { Document } from "mongoose";
import { IResource } from "./resource";
import { IEpic } from "./epic";
import { ITask } from "./task";

export interface IProject extends Document {
  name: string;
  description?: string;
  prompt?: string;
  userId: string;
  deleted: boolean;
  resources: IResource[];
  epics: IEpic[];
  tasks: ITask[];
}

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (name: string) {
        // Regular expression for name validation contains letters,numbers and - , and it has a max of 20 characters
        return /^[a-zA-Z0-9-\s]{1,40}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid name!`,
    },
  },
  description: {
    type: String,
    required: false,
    validate: function (description: string) {
      // Regular expression for description validation contains letters,numbers and - , and it has a max of 100 characters
      return /^[a-zA-Z0-9-.,\s]{1,175}$/.test(description);
    },
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
  },
});

const Project = mongoose.model<IProject>("project", ProjectSchema);
export default Project;
