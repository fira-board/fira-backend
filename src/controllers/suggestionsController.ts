
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import Epic from "../models/epic";
import { generateEpicSugestions } from "../models/ai/epic/EpicSuggestionsGenerator";
import { generateTaskSugestions } from "../models/ai/task/TaskSuggestionsGenerator";
import Project from "../models/project";
import Resource from "../models/resource";

export const suggestNewEpic = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();
        const projectId = req.query.projectId;
        const resourceId = req.query.resourceId;
        const order = req.query.order;

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        const project = await Project.findById({ _id: projectId, owner: userId })!;
        const resource = await Resource.findById({ _id: resourceId, owner: userId });

        if (project && resource) {
            res.send(await generateEpicSugestions(project, Number(order), resource.title));

        } else {
            res.status(400).send("Unauthorized");
        }

    } catch (err) {
        res.status(500).send(err);
    }
}



export const suggestNewTask = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();
        const projectId = req.query.projectId;
        const epicId = req.query.epicId;
        const order = req.query.order;

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        const project = await Project.findById({ _id: projectId, owner: userId })!;
        const epic = await Epic.findById({ _id: epicId, owner: userId });

        if (project && epic) {
            res.send(await generateTaskSugestions(project, Number(order), epic.title));

        } else {
            res.status(400).send("Unauthorized");
        }

    } catch (err) {
        res.status(500).send(err);
    }
}



export const suggestAReviewforProject = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        res.json("sucessfully added feedback");
    } catch (err) {
        res.status(500).send(err);
    }
}


