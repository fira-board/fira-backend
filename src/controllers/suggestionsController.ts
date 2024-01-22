
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import Epic from "../models/epic";
import { generateEpicSugestions } from "../models/ai/epic/EpicSuggestionsGenerator";
import { generateTaskSugestions } from "../models/ai/task/TaskSuggestionsGenerator";
import Project from "../models/project";
import Resource from "../models/resource";

export const suggestNewEpic = async (req: SessionRequest, res: Response) => {
    const userId = req.session!.getUserId();
    const projectId = req.query.projectId;
    const resourceId = req.query.resourceId;
    const order = req.query.order;
    const model = req.model || '';


    const project = await Project.findById({ _id: projectId, owner: userId })!;
    const resource = await Resource.findById({ _id: resourceId, owner: userId });

    if (project && resource) {
        const response = await generateEpicSugestions(project, Number(order), resource.title, model);
        res.header("usage", response.usage);
        res.send(response.data);

    } else {
        res.status(400).send("Unauthorized");
    }

}

export const suggestNewTask = async (req: SessionRequest, res: Response) => {
    const userId = req.session!.getUserId();
    const projectId = req.query.projectId;
    const epicId = req.query.epicId;
    const order = req.query.order;
    const model = req.model || '';


    const project = await Project.findById({ _id: projectId, owner: userId })!;
    const epic = await Epic.findById({ _id: epicId, owner: userId });

    if (project && epic) {
        res.send(await generateTaskSugestions(project, Number(order), epic.title, model));

    } else {
        res.status(400).send("Unauthorized");
    }
}



export const suggestAReviewforProject = async (req: SessionRequest, res: Response) => {
    //nothing to see here for now 
    res.json("sucessfully added feedback");
}
