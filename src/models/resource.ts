import mongoose from "mongoose";
import { IResource } from "./types";

const ResourceSchema = new mongoose.Schema({
  title: String,
  userId:String,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
    },
  ],
  epics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resource",
    },
  ],
});

const Resource = mongoose.model<IResource>("resource", ResourceSchema);
export default Resource;
