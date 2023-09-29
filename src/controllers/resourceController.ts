import Resource from "../models/resource";
import Project from "../models/project";
import Epic from "../models/epic";
import Task from "../models/task";
import fetchWithReferences from "../utility/referenceMapping"
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

export const listResources = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    const { projectId } = req.query;

    const query: any = {};

    query.userId = userId;

    if (projectId) {
      query.project = projectId;
    }

    let resources = await Resource.find(query);

    if (req.query.fetch) {
      resources = await fetchWithReferences(resources, "resource");
    }

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

    let resource = await Resource.findOne({ _id: req.params.id, userId: userId });

    if (!resource) {
      return res.status(404).send("Resource not found");
    }

    if (req.query.fetch) {
      resource = await fetchWithReferences(resource, "resource");
    }

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

    if (!updated) {
      return res.status(404).send("Resource not found");
    }

    console.log("Resource updated successfully");
    res.json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
};
