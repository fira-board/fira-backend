import Resource from "../models/resource";
import Project from "../models/project";
import Epic from "../models/epic";
import Task from "../models/task";
import { Request, Response } from "express";

export const listResources = async (req: Request, res: Response) => {
  try {
    // Get filter parameters from the request query
    const { userId, projectId } = req.query;

    // Build a query object based on the provided filters
    const query: any = {};

    query.userId = userId;

    if (projectId) {
      query.project = projectId;
    }

    // Find tasks based on the query object
    const resources = await Resource.find(query);

    res.json(resources);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const newResource = new Resource({
      title: req.body.title,
      project: req.body.projectId,
    });

    await newResource.save();

    if (req.body.projectId) {
      await Project.findByIdAndUpdate(req.body.projectId, {
        $push: { resources: newResource._id },
      });
    }

    res.json(newResource._id);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const listResource = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id });
    console.log("Resource found");
    res.json(resource);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    // Mark the resource as deleted instead of deleting it
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).send("Resource not found");
    }

    // Mark epics and their tasks as deleted
    if (resource.epics.length) {
      await Epic.updateMany(
        { _id: { $in: resource.epics } },
        { deleted: true }
      );
      await Task.updateMany(
        { _id: { $in: resource.tasks } },
        { deleted: true }
      );
    }

    // Remove epics and ids from project
    if (resource.project) {
      await Project.findByIdAndUpdate(resource.project, {
        $pull: {
          epics: { $in: resource.epics },
          tasks: { $in: resource.tasks },
          resources: req.params.id,
        },
      });
    }

    await Resource.deleteOne({ _id: req.params.id });
    res.json({ message: "Resource deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateResource = async (req: Request, res: Response) => {
  try {
    const updatedData = {
      title: req.body.title,
      epics: req.body.epics,
      project: req.body.project,
    };
    const updated = await Resource.updateOne(
      { _id: req.params.id },
      updatedData
    );
    console.log("Resource updated successfully");
    res.json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
};
