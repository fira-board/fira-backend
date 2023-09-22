import Task from '../models/task';
import { Request, Response } from 'express';

export const listTasks = async (req: Request, res: Response) => {
       try {
        // Get filter parameters from the request query
        const { userId, resourceIds, epicId } = req.query;

        // Build a query object based on the provided filters
        const query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (resourceIds) {
            query.resourceIds = { $in: resourceIds instanceof Array ? resourceIds : [resourceIds] };
        }

        if (epicId) {
            query.epicId = epicId;
        }

        // Find tasks based on the query object
        const tasks = await Task.find(query);

        res.json(tasks);
    } catch (err) {
        res.status(500).send(err);
}};

export const createTask = async (req: Request, res: Response) => {
    try {
        const newTask = await new Task({
            title: req.body.title,
            status: req.body.status,
            estimateDaysToFinish: req.body.estimateDaysToFinish,
            epic: req.body.epicId,
            resource: req.body.resourceId,
            project: req.body.projectId
        });

        await newTask.save();
        res.json(newTask._id);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getTask = async (req: Request, res: Response) => {
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