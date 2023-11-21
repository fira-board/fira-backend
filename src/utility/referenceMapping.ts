import Resource from "../models/resource";
import Epic, { IEpic } from "../models/epic";
import Task from "../models/task";
import  { IProject } from "../models/project";

export const fetchProject = async (project: IProject) => {
    
    project.resources = await Resource.find({ project: project._id, deleted: false });
    project.epics = await Epic.find({ project: project._id, deleted: false });
    project.tasks = await Task.find({ project: project._id, deleted: false });
    
    return project;
};

export const fetchEpic = async (epic: IEpic) => {
    epic.tasks = await Task.find({ epic: epic._id, deleted: false });
    return epic;
};