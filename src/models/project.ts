import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { IResource } from "./resource";
import { IEpic } from "./epic";
import { ITask } from "./task";

type Ref<T extends Document> = T | Types.ObjectId;


export interface IProject extends Document {
  name: string;
  description?: string;
  prompt?: string;
  userId: string;
  resources: Ref<IResource>[];
  epics: Ref<IEpic>[];
  tasks: Ref<ITask>[];
}

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (name: string) {
        // Regular expression for name validation contains letters,numbers and - , and it has a max of 20 characters
        return /^[a-zA-Z0-9-]{1,20}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid name!`,
    }
  },
  description: {
    type: String,
    required: false,
    validate: function (description: string) {
      // Regular expression for description validation contains letters,numbers and - , and it has a max of 100 characters
      return /^[a-zA-Z0-9-]{1,100}$/.test(description);
    }
  },
  prompt: String,
  userId: {
    type: String,
    required: true,
  },
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resource",
    },
  ],
  epics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "epic",
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
    },
  ],
});

const Project = mongoose.model<IProject>("project", ProjectSchema);
export default Project;
