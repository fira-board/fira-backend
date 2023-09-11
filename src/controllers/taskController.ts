import Task from '../models/task';
import { Request, Response } from 'express';

export const listTasks = async (req: Request, res: Response) => {
    try {
        console.log(req);
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
};

// TODO: add logic of task generator
export const createTask = async () => {
    console.log("Creating task");
};

export const listTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findOne({ _id: req.params.id });
          console.log('Task found');
          res.json(task);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const deleted = await Task.deleteOne({ _id: req.params.id });
          console.log('Task deleted successfully');
          res.json(deleted);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const updatedData = {
            title: req.body.title,
            status: req.body.status,
            estimateDaysToFinish: req.body.estimateDaysToFinish,
            epic: req.body.epic,
        }
        const updated = await Task.updateOne({ _id: req.params.id }, updatedData);
          console.log('Task updated successfully');
          res.json(updated);
    } catch (err) {
        res.status(500).send(err);
    }
};