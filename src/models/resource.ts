import mongoose from "mongoose";
import { Document } from 'mongoose';

export interface IResource extends Document {
  title: String;
  userId: String;
  color: string;
}

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String, required: true, 
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
