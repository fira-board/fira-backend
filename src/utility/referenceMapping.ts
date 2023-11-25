import Resource from "../models/resource";
import Epic, { IEpic } from "../models/epic";
import Task from "../models/task";
import { IProject } from "../models/project";

export const fetchProject = async (project: IProject) => {
  project.resources = await Resource.find({
  });
  project.epics = await Epic.find({ project: project._id, deleted: false }).populate('resource');
  project.tasks = await Task.find({ project: project._id, deleted: false });

  return {
    ...project.toObject(),
    resources: project.resources,
    epics: project.epics,
    tasks: project.tasks,
  };
};

export const fetchEpic = async (epic: IEpic) => {
  epic.tasks = await Task.find({ epic: epic._id, deleted: false });
  return epic;
};
