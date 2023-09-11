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

// TODO: add logic of epic generator
export const createEpic = async () => {
    console.log("Creating epic");
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