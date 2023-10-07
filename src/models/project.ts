import mongoose from "mongoose";
import { IProject } from "./types";

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  prompt: String,
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
  userId: String,
});

const Project = mongoose.model<IProject>("project", ProjectSchema);
export default Project;
