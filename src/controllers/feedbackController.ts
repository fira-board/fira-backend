
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import Feedback from "../models/feedback";
import Epic from "../models/epic";
import Task from "../models/task";



export const createFeedback = async (req: SessionRequest, res: Response) => {
    const userId = req.session!.getUserId();
    const epic = await Epic.findById(req.body.epicId);
    const tasks = Task.find({ epic: req.body.epicId });

    const newFeedback = await new Feedback({
        suggestion: req.body.suggestion,
        status: req.body.status,
        userId: userId,
        epic: epic,
        tasks: tasks,
        project: epic?.project,
    });

    await newFeedback.save();
    res.json("sucessfully added feedback");
}

