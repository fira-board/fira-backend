
import e, { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import Feedback from "../models/feedback";
import Epic from "../models/epic";
import Task from "../models/task";
import { generateEpicSugestions } from "../models/ai/epic/EpicSuggestionsGenerator";
import Project from "../models/project";
import Resource from "../models/resource";



export const suggestNewEpic = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();
        const projectId = req.params.projectId;
        const resourceId = req.params.resourceId;
        const order = parseInt(req.params.order);

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        const project = await Project.findById({ _id: projectId, owner: userId })!;
        const resource = await Resource.findById({ _id: resourceId, owner: userId });

        if (project && resource) {
            res.send(generateEpicSugestions(project, order, resource.title));

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

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        res.json("sucessfully added feedback");
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


