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
        if (req.params.empty)
            res.status(201).send(new Project(req.body).save());
        else {
            generateProjectPlan(req.body.summary).then(async (projectPlan) => {

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

                let project = await new Project({ name: projectName, description: projectDescription, resources: projectResources, epics: projectEpics, tasks: projectTasks, userId: userId, contributors: req.body.contributors }).save();

                res.status(201).send(project);
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// ... You can add more controller functions for update, delete, and add contributors.
