import Task from "../models/task";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { generateTaskDescription } from "../models/ai/task/TaskSuggestionsGenerator";
import Epic from "../models/epic";
import { SYSTEM_TO_DO } from "../models/status";

export const listTasks = async (req: SessionRequest, res: Response) => {
  // Build a query object based on the provided filters
  const query: any = req.query;//dont let loose
  query.project = req.params.projectId;
  query.deleted = false;

  // Find tasks based on the query object
  const tasks = await Task.find(query).populate("resource").populate("epic");

  res.json(tasks);
};

export const createTask = async (req: SessionRequest, res: Response) => {
  const userId = req.session!.getUserId();

  const newTask = new Task({
    title: req.body.title,
    status: SYSTEM_TO_DO,
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
    { _id: req.params.id, project: req.params.projectId },
    { deleted: true }
  );

  if (!deleted) {
    return res.status(404).send("Task not found");
  }
  Epic.updateOne({ _id: deleted.epic }, { $pull: { tasks: deleted._id } });
  console.debug("Task deleted successfully");
  res.json(deleted);
};

export const updateTask = async (req: SessionRequest, res: Response) => {

  if (req.body.startDate || req.body.endDate) {
    if (!(req.body.startDate && req.body.endDate) || (req.body.startDate > req.body.endDate)) {
      return res.status(400).send("Start Date and End Date are Required and Start Date Must be Less than End Date");
    }
  }

  const oldTask = await Task.findOne({
    _id: req.params.id,
    project: req.params.projectId,
    deleted: false,
  });

  if (!oldTask) {
    return res.status(404).send("Task not found");
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.id, project: req.params.projectId, deleted: false },
    req.body,
    { new: true }
  );

  console.debug("Task updated successfully");
  res.json(updatedTask);
};

export const generateDescription = async (req: SessionRequest, res: Response) => {
  const taskId = req.params.id;
  const userInput = req.body.userInput || '';
  const model = req.model || '';

  const task = await Task.findOne({
    _id: taskId,
    project: req.params.projectId,
    deleted: false,
  })
    .populate({
      path: 'epic',
      populate: {
        path: 'tasks',
        match: { deleted: false },
        select: 'title'
      }
    });

  if (!task) {
    res.status(404).send("Task not found");
    return;
  }

  // Get the epics tasks titles excluding the one we are generating a description for
  const otherTaskTitles: string[] = (task?.epic as any)?.tasks?.filter((t: any) => t._id.toString() !== task._id.toString()).map((t: any) => t.title) || [];

  const response = await generateTaskDescription(task?.title, (task?.epic as any)?.title, otherTaskTitles, userInput, model);

  res.header("completion_tokens", response.usage.completion_tokens);
  res.header("prompt_tokens", response.usage.prompt_tokens);

  res.json(response.data.description)
}