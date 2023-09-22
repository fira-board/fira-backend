import Resource from '../models/resource';
import { Request, Response } from 'express';

export const listResources = async (req: Request, res: Response) => {
    try {
        console.log(req);
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const createResource = async (req: Request, res: Response) => {
    try {
        const newResource = new Resource({
            title: req.body.title,
            epics: req.body.epicIds,
            project: req.body.projectId
        });

        await newResource.save();
        res.json(newResource._id);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const listResource = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findOne({ _id: req.params.id });
          console.log('Resource found');
          res.json(resource);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    try {
        const deleted = await Resource.deleteOne({ _id: req.params.id });
          console.log('Resource deleted successfully');
          res.json(deleted);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateResource = async (req: Request, res: Response) => {
    try {
        const updatedData = {
            title: req.body.title,
            epics: req.body.epics,
            project: req.body.project,
        }
        const updated = await Resource.updateOne({ _id: req.params.id }, updatedData);
          console.log('Resource updated successfully');
          res.json(updated);
    } catch (err) {
        res.status(500).send(err);
    }
};