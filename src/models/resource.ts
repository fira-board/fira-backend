import mongoose from "mongoose";
import { Document } from 'mongoose';

export interface IResource extends Document {
  title: String;
  userId: String;
  color: string;
}

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String, required: true, validate: {
      validator: function (name: string) {
        // Regular expression for title validation contains letters,numbers and - , and it has a max of 60 characters
        return /^[a-zA-Z0-9-,\s./]{1,60}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid title!`,
    }
  },
  userId: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: function() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
  },
});

const Resource = mongoose.model<IResource>("resource", ResourceSchema);
export default Resource;
