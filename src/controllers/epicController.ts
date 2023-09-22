import Epic from '../models/epic';
import { Request, Response } from 'express';

export const listEpics = async (req: Request, res: Response) => {
    try {
        console.log(req);
        const epics = await Epic.find();
        res.json(epics);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const createEpic = async (req: Request, res: Response) => {
    try {
        const newEpic= new Epic({
            title: req.body.title,
            status: req.body.status,
            tasks: req.body.taskIds,
            resource: req.body.resourceId,
            project: req.body.projectId
        });

        await newEpic.save();
        res.json(newEpic._id);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const listEpic = async (req: Request, res: Response) => {
    try {
        const epic = await Epic.findOne({ _id: req.params.id });
          console.log('Epic found');
          res.json(epic);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deleteEpic = async (req: Request, res: Response) => {
    try {
        const deleted = await Epic.deleteOne({ _id: req.params.id });
          console.log('Epic deleted successfully');
          res.json(deleted);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateEpic = async (req: Request, res: Response) => {
    try {
        const updatedData = {
            title: req.body.title,
            status: req.body.status,
            resource: req.body.resource,
            tasks: req.body.tasks,
        }
        const updated = await Epic.updateOne({ _id: req.params.id }, updatedData);
          console.log('Epic updated successfully');
          res.json(updated);
    } catch (err) {
        res.status(500).send(err);
    }
};