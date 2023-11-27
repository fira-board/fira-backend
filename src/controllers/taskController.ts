import Task from "../models/task";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

export const listTasks = async (req: SessionRequest, res: Response) => {
  // Build a query object based on the provided filters
  const query: any = req.query;
  query.projectId = req.params.projectId;
  query.deleted = false;

  // Find tasks based on the query object
  const tasks = await Task.find(query).populate("resource").populate("epic");

  res.json(tasks);
};

export const createTask = async (req: SessionRequest, res: Response) => {

  const userId = req.session!.getUserId();

  const newTask = new Task({
    title: req.body.title,
    status: "Not Started",
    estimateDaysToFinish: req.body.estimateDaysToFinish,
    epic: req.body.epicId,
    resource: req.body.resourceId,
    project: req.params.projectId,
    userId: userId,
  }).save();

  res.status(201).json(newTask);
};

export const getTask = async (req: SessionRequest, res: Response) => {

  let task = await Task.findOne({
    _id: req.params.id,
    project: req.params.projectId,
    deleted: false,
  }).populate("resource").populate("epic");

  if (!task) {
    return res.status(404).send("Task not found");
  }

  res.json(task);
};

export const deleteTask = async (req: SessionRequest, res: Response) => {
  const deleted = await Task.findOneAndUpdate(
    { _id: req.params.id },
    { deleted: true }
  );

  if (!deleted) {
    return res.status(404).send("Task not found");
  }

  console.debug("Task deleted successfully");
  res.json(deleted);
};

export const updateTask = async (req: SessionRequest, res: Response) => {

  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, project: req.params.projectId },
    req.body
  );

  if (!updated) {
    return res.status(404).send("Task not found");
  }

  console.debug("Task updated successfully");
  res.json(updated);
};
