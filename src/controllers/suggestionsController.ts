
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import Feedback from "../models/feedback";
import Epic from "../models/epic";
import Task from "../models/task";
import Project from "../models/project";



export const suggestNewEpic = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.session!.getUserId();
        
        const projectId = req.params.projectId

        if (userId === undefined) {
            res.status(401).send("Unauthorized");
        }

        const project = await Project.find({_id: projectId, owner: userId});

        if( project === null){
            res.status(400).send("Unauthorized");
        }

        const epics = Epic.find({ _id: { $in: project.epics} },{ deleted: false });

        
        res.json("sucessfully added feedback");
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


