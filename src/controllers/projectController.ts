import Project from '../models/project';
import Task from '../models/task';
import Epic from '../models/epic';
import Resource from '../models/resource';
import { generateProjectPlan } from '../models/ai/ProjectPlanGenerator';
import { Request, Response } from 'express';

export const listProjects = async (req: Request, res: Response) => {
    try {
        console.log(req);
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        let userId = "uuid21312321";
        if (req.params.empty) {
            res.status(201).send(await new Project(req.body).save());
        }
        else {
            const projectPlan = await generateProjectPlan(req.body.summary);

            let resourceIds = [];

            for (const resourceData of projectPlan.resources) {
                let epicIds = [];
                for (const epicData of resourceData.epics) {
                    let taskIds = [];
                    for (const taskData of epicData.tasks) {
                        const savedTask = await new Task({
                            title: taskData.title,
                            status: "Not Started",
                            estimateDaysToFinish: taskData.estimateDaysToFinish,
                        }).save();
                        taskIds.push(savedTask._id);
                    }
                    const savedEpic = await new Epic({
                        title: epicData.title,
                        tasks: taskIds
                    }).save();
                    epicIds.push(savedEpic._id);
                }
                const savedResource = await new Resource({
                    title: resourceData.title,
                    epics: epicIds
                }).save();
                resourceIds.push(savedResource._id);
            }

            await new Project({
                name: projectPlan.projectName,
                description: projectPlan.description,
                prompt: req.body.summary,
                resources: resourceIds,
                userId: userId
            }).save();

            return res.json(projectPlan);

        }
    } catch (err) {
        console.error("Error in createProject:", err);
        res.status(500).send('Internal Server Error');
    }
};

export const listProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findOne({ _id: req.params.id });
          console.log('Project found');
          res.json(project);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const deleted = await Project.deleteOne({ _id: req.params.id });
          console.log('Project deleted successfully');
          res.json(deleted);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            prompt: req.body.description,
            resources: req.body.resources,
        }
        const updated = await Project.updateOne({ _id: req.params.id }, updatedData);
          console.log('Project updated successfully');
          res.json(updated);
    } catch (err) {
        res.status(500).send(err);
    }
};