import Task from "../models/task";
import Epic from "../models/epic";
import Resource from "../models/resource";
import Project from "../models/project";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

export const listTasks = async (req: SessionRequest, res: Response) => {
  try {
    // Get filter parameters from the request query

    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    const { projectId, epicId } = req.query;

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

export const createTask = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    // Cannot create task without epicId, resourceId, projectId
    if (
      req.body.epicId === undefined ||
      req.body.resourceId === undefined ||
      req.body.projectId === undefined
    ) {
      res.status(400).send("Prerequisite element ID required");
    }

    const newTask = await new Task({
      title: req.body.title,
      status: "Not Started",
      estimateDaysToFinish: req.body.estimateDaysToFinish,
      epic: req.body.epicId,
      resource: req.body.resourceId,
      project: req.body.projectId,
      userId: userId,
    });

    await newTask.save();

    await Epic.findByIdAndUpdate(req.body.epicId, {
      $push: { tasks: newTask._id },
    });

    await Resource.findByIdAndUpdate(req.body.resourceId, {
      $push: { tasks: newTask._id },
    });

    await Project.findByIdAndUpdate(req.body.projectId, {
      $push: { tasks: newTask._id },
    });

    res.json(newTask._id);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getTask = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: userId,
      deleted: false,
    });
    if (!task) {
      return res.status(404).send("Task not found or marked as deleted");
    }
    console.log("Task found");
    res.json(task);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteTask = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    const deleted = await Task.updateOne(
      { _id: req.params.id, userId: userId },
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

    if (task.resource) {
      await Resource.findByIdAndUpdate(task.resource, {
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

export const updateTask = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    const updatedData = {
      title: req.body.title,
      status: req.body.status,
      estimateDaysToFinish: req.body.estimateDaysToFinish,
      epic: req.body.epic,
    };
    const updated = await Task.updateOne(
      { _id: req.params.id, userId: userId },
      updatedData
    );
    console.log("Task updated successfully");
    res.json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
};
