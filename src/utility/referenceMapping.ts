import Epic, { IEpic } from "../models/epic";
import Task from "../models/task";
import { IProject } from "../models/project";

export const fetchProject = async (project: IProject) => {
  return {
    ...project.toObject(),
    epics: await Epic.find({ project: project._id, deleted: false }).populate('resource').sort({ 'resource._id': 1 }),
    tasks: await Task.find({ project: project._id, deleted: false }),
  };
};

export const fetchEpic = async (epic: IEpic) => {
  return {
    ...epic.toObject(),
    tasks: await Task.find({ epic: epic._id, deleted: false }),
  };
};
