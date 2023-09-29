import Epic from "../models/epic";
import Project from "../models/project";
import Resource from "../models/resource";
import Task from "../models/task";
import fetchWithReferences from "../utility/referenceMapping"
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

export const listEpics = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        const { projectId, resourceId } = req.query;

        const query: any = {};

        query.userId = userId;

        if (projectId) {
            query.project = projectId;
        }

        if (resourceId) {
            query.resource = resourceId;
        }

        query.deleted = false;
        let epics = await Epic.find(query);

        if (req.query.fetch) {
            epics = await fetchWithReferences(epics, "epic");
        }

        res.json(epics);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const createEpic = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        const newEpic = new Epic({
            title: req.body.title,
            status: req.body.status,
            resource: req.body.resourceId,
            project: req.body.projectId,
            userId: userId,
        });

        await newEpic.save();

        if (req.body.resourceId) {
            await Resource.findByIdAndUpdate(req.body.resourceId, {
                $push: { epics: newEpic._id },
            });
        }

        if (req.body.projectId) {
            await Project.findByIdAndUpdate(req.body.projectId, {
                $push: { epics: newEpic._id },
            });
        }

        res.json(newEpic._id);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const listEpic = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        let epic = await Epic.findOne({
            _id: req.params.id,
            userId: userId,
            deleted: false,
        });

        if (!epic) {
            return res.status(404).send("Epic not found or marked as deleted");
        }

    if (req.query.fetch) {
        epic = await fetchWithReferences(epic, "epic");
    }

        console.log("Epic found");
        res.json(epic);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deleteEpic = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        // Mark epic as deleted
        const deleted = await Epic.updateOne(
            { _id: req.params.id, userId: userId },
            { deleted: true }
        );

        const epic = await Epic.findOne({ _id: req.params.id });
        if (!epic) {
            return res.status(404).send("Epic not found");
        }

        // Remove epic from resource
        if (epic.resource) {
            await Resource.findByIdAndUpdate(epic.resource, {
                $pull: { epics: req.params.id },
            });
        }

        // Remove epic from project
        if (epic.project) {
            await Project.findByIdAndUpdate(epic.project, {
                $pull: {
                    epics: req.params.id,
                    tasks: { $in: epic.tasks },
                },
            });
        }

        // Delete tasks within the epic in project, mark tasks as deleted
        if (epic.tasks && epic.tasks.length > 0) {
            await Project.updateMany(
                {},
                {
                    $pull: { tasks: { $in: epic.tasks } },
                }
            );

            await Task.updateMany(
                { _id: { $in: epic.tasks } },
                {
                    deleted: true,
                }
            );
        }

        console.log("Epic deleted successfully");
        res.json(deleted);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateEpic = async (req: SessionRequest, res: Response) => {
    try {

        const userId = req.session!.getUserId();

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        const updatedData = {
            title: req.body.title,
            status: req.body.status,
            resource: req.body.resource,
            tasks: req.body.tasks,
            userId: userId,
        };
        const updated = await Epic.updateOne({ _id: req.params.id }, updatedData);

        if (!updated) {
            return res.status(404).send("Epic not found");
          }

        console.log("Epic updated successfully");
        res.json(updated);
    } catch (err) {
        res.status(500).send(err);
    }
};
