import mongoose from "mongoose";
import { Document } from 'mongoose';

export interface IResource extends Document {
  title: String;
  userId: String;
}

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String, required: true, validate: {
      validator: function (name: string) {
        // Regular expression for title validation contains letters,numbers and - , and it has a max of 20 characters
        return /^[a-zA-Z0-9-]{1,20}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid title!`,
    }
  },
  userId: {
    type: String,
    required: true,
  },
});

const Resource = mongoose.model<IResource>("resource", ResourceSchema);
export default Resource;
