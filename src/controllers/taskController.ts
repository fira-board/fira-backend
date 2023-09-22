import Task from "../models/task";
import Epic from "../models/epic";
import Project from "../models/project";
import { Request, Response } from "express";

export const listTasks = async (req: Request, res: Response) => {
  try {
    // Get filter parameters from the request query
    const { userId, projectId, epicId } = req.query;

    // Build a query object based on the provided filters
    const query: any = {};

    query.userId = userId;

    if (projectId) {
      query.project = projectId;
    }

    if (epicId) {
      query.epic = epicId;
    }

    query.deleted = false;
    // Find tasks based on the query object
    const tasks = await Task.find(query);

    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const newTask = await new Task({
      title: req.body.title,
      status: req.body.status,
      estimateDaysToFinish: req.body.estimateDaysToFinish,
      epic: req.body.epicId,
      resource: req.body.resourceId,
      project: req.body.projectId,
    });

    await newTask.save();

    if (req.body.epicId) {
      await Epic.findByIdAndUpdate(req.body.epicId, {
        $push: { tasks: newTask._id },
      });
    }

    if (req.body.projectId) {
      await Project.findByIdAndUpdate(req.body.projectId, {
        $push: { tasks: newTask._id },
      });
    }

    res.json(newTask._id);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, deleted: false });
    if (!task) {
      return res.status(404).send("Task not found or marked as deleted");
    }
    console.log("Task found");
    res.json(task);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deleted = await Task.updateOne(
      { _id: req.params.id },
      { deleted: true }
    );
    const task = await Task.findOne({ _id: req.params.id });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    if (task.epic) {
      await Epic.findByIdAndUpdate(task.epic, {
        $pull: { tasks: task._id },
      });
    }

    if (task.project) {
      await Project.findByIdAndUpdate(task.project, {
        $pull: { tasks: task._id },
      });
    }

    console.log("Task deleted successfully");
    res.json(deleted);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const updatedData = {
      title: req.body.title,
      status: req.body.status,
      estimateDaysToFinish: req.body.estimateDaysToFinish,
      epic: req.body.epic,
    };
    const updated = await Task.updateOne({ _id: req.params.id }, updatedData);
    console.log("Task updated successfully");
    res.json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
};
