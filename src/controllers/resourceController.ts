import Resource from "../models/resource";
import Project from "../models/project";
import Epic from "../models/epic";
import Task from "../models/task";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

export const listResources = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    // Get filter parameters from the request query
    const { projectId } = req.query;

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

export const createResource = async (req: SessionRequest, res: Response) => {
  try {

    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    // Cannot create resource without projectId
    if (
      req.body.projectId === undefined
    ) {
      res.status(400).send("Prerequisite element ID required");
    }

    const newResource = new Resource({
      title: req.body.title,
      project: req.body.projectId,
      userId: userId,
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

export const listResource = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }


    const resource = await Resource.findOne({ _id: req.params.id, userId: userId });
    console.log("Resource found");
    res.json(resource);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteResource = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }


    // Mark the resource as deleted instead of deleting it
    const resource = await Resource.findOne({ _id: req.params.id, userId: userId });

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

export const updateResource = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    const updatedData = {
      title: req.body.title,
      epics: req.body.epics,
      project: req.body.project,

    };
    const updated = await Resource.updateOne(
      { _id: req.params.id, userId: userId },
      updatedData
    );
    console.log("Resource updated successfully");
    res.json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
};
