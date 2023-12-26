import mongoose from "mongoose";
import { Document } from 'mongoose';

export interface IStatus extends Document {
  title: string;
  userId: string;
  color: string;
  order: number;
}

const StatusSchema = new mongoose.Schema({
  title: {
    type: String, required: true, validate: {
      validator: function (name: string) {
        // Regular expression for title validation contains letters,numbers and - , and it has a max of 20 characters
        return /^[a-zA-Z0-9-,\s./]{1,20}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid title!`,
    }
  },
  userId: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0,
    required: true
  },
});

const Status = mongoose.model<IStatus>("status", StatusSchema);
export default Status;
