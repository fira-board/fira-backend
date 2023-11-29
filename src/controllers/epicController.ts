import Epic from "../models/epic";
import Task from "../models/task";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import mongoose from "mongoose";
import { IEpic } from "../models/epic";
import Project from "../models/project";

export const listEpics = async (req: SessionRequest, res: Response) => {
  const fetchTasks = req.query.fetch === 'true';
  const includeDeleted = req.query.includeDeleted === 'true';

  let query: mongoose.Query<IEpic[], IEpic> = Epic.find({}).populate('resource').where('deleted').equals(includeDeleted);

  if (fetchTasks) {
    if (includeDeleted) {
      query = query.populate('tasks');
    } else {
      query = query.populate({
        path: 'tasks',
        match: { deleted: false }
      });
    }
  }

  const epics = await query.exec();
  res.json(epics);
};

export const createEpic = async (req: SessionRequest, res: Response) => {
  const userId = req.session!.getUserId();
  const projectId = req.params.projectId;
  const project = await Project.findById(projectId).
    where('deleted').equals(false);

  if (!project) {
    return res.status(404).send("Project not found");
  }

  const newEpic = await new Epic({
    title: req.body.title,
    status: req.body.status,
    resource: req.body.resourceId,
    project: projectId,
    userId: userId,
  }).save();

  //push epic to project
  project.epics.push(newEpic._id);
  await project.save();

  res.json(newEpic);
};

export const getEpic = async (req: SessionRequest, res: Response) => {
  const fetchTasks = req.query.fetch === 'true';
  const includeDeleted = req.query.includeDeleted === 'true';

  let query: mongoose.Query<IEpic | null, IEpic> = Epic.findOne({
    _id: req.params.id,
    project: req.params.projectId
  }).populate('resource').where('deleted').equals(includeDeleted);

  if (fetchTasks) {
    if (includeDeleted) {
      query = query.populate('tasks');
    } else {
      query = query.populate({
        path: 'tasks',
        match: { deleted: false }
      });
    }
  }

  const epic = await query.exec();

  if (!epic) {
    return res.status(404).send('Epic not found or has been deleted');
  }
  res.json(epic);
};

export const deleteEpic = async (req: SessionRequest, res: Response) => {

  // Mark epic as deleted
  const deleted = await Epic.findOneAndUpdate(
    { _id: req.params.id, project: req.params.projectId, deleted: false },
    { deleted: true }
  ).lean();

  if (!deleted) {
    return res.status(404).send("Epic not found");
  }

  // Delete tasks within the epic in project, mark tasks as deleted
  await Task.updateMany(
    { epic: req.params.id },
    {
      deleted: true,
    }
  );

  console.log("Epic deleted successfully");
  res.json(deleted);
};

export const updateEpic = async (req: SessionRequest, res: Response) => {
  const updatedData = {
    title: req.body.title,
    status: req.body.status,
    resource: req.body.resourceId,
    tasks: req.body.tasks,
    order: req.body.order,
  };
  const updated = await Epic.findOneAndUpdate(
    { _id: req.params.id, project: req.params.projectId, deleted: false }, updatedData
  ).lean();

  if (!updated)
    return res.status(404).send("Epic not found");

  res.json(updated);
};
