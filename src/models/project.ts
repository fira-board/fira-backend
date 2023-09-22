import mongoose from "mongoose";

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

const Project = mongoose.model("project", ProjectSchema);
export default Project;
