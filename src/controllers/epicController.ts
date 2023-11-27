import Epic from "../models/epic";
import Task from "../models/task";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import mongoose from "mongoose";
import { IEpic } from "../models/epic";

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


  const newEpic = new Epic({
    title: req.body.title,
    status: req.body.status,
    resource: req.body.resourceId,
    project: req.params.projectId,
    userId: userId,
  });

  await newEpic.save();

  res.json(newEpic._id);
};

export const getEpic = async (req: SessionRequest, res: Response) => {
  const { id } = req.params;
  const fetchTasks = req.query.fetch === 'true';
  const includeDeleted = req.query.includeDeleted === 'true';

  let query: mongoose.Query<IEpic | null, IEpic> = Epic.findById(id).populate('resource').where('deleted').equals(includeDeleted);

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
    { _id: req.params.id, project: req.params.projectId },
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
