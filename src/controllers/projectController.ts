import Project from '../models/project';
import Task from '../models/task';

import { generateProjectPlan } from '../models/ai/ProjectPlanGenerator';

import { Request, Response } from 'express';
import { ITask } from '../models/types';

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

            let projectName = projectPlan?.projectName;
            let projectDescription = projectPlan?.description;
            let projectResources: string[] = [];
            let projectEpics: string[] = [];
            let projectTasks: ITask[] = [];

            projectPlan?.resources.forEach((resource) => {
                let resourceName = resource.name;
                projectResources.push(resourceName);
                resource.epics.forEach((epic) => {
                    let epicName = epic.name;
                    projectEpics.push(epicName);
                    epic.tasks.forEach((task) => {
                        projectTasks.push(new Task({ title: task.title, resource: resourceName, epic: epicName, estimateDaysToFinish: task.estimateDaysToFinish }));
                    });
                });
            });

            let project = await new Project({ 
                name: projectName, 
                description: projectDescription, 
                resources: projectResources, 
                epics: projectEpics, 
                tasks: projectTasks, 
                userId: userId, 
                contributors: req.body.contributors 
            }).save();

            res.status(201).send(project);
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
            resources: req.body.resources,
            epics: req.body.epics,
            tasks: req.body.tasks,
            contributors: req.body.contributors,
        }
        const updated = await Project.updateOne({ _id: req.params.id }, updatedData);
          console.log('Project updated successfully');
          res.json(updated);
    } catch (err) {
        res.status(500).send(err);
    }
};