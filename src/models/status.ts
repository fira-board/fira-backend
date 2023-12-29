import mongoose from "mongoose";
import { Document } from 'mongoose';


export const SYSTEM_TO_DO = new mongoose.Types.ObjectId("6f43ca18574e564d919b9c1f");
export const SYSTEM_IN_PROGRESS = new mongoose.Types.ObjectId("cdbf7f6e3fb07d7850b953b1");
export const SYSTEM_DONE = new mongoose.Types.ObjectId("1787fac32fc603009219ad43");

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
