import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { IEpic } from "./epic";



// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;

export interface IProject extends Document {
  name: string;
  description?: string;
  prompt?: string;
  userId: string;
  deleted: boolean;
  epics: Ref<IEpic>[];
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
  }, epics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resource",
    },
  ],
});

const Project = mongoose.model<IProject>("project", ProjectSchema);
export default Project;
