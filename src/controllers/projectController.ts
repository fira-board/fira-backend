import Project from '../models/project';
import Task from '../models/task';
import Epic from '../models/epic';
import Resource from '../models/resource';

import { generateProjectPlan } from '../models/ai/ProjectPlanGenerator';

import { Request, Response } from 'express';
import { ITask, IEpic, IResource } from '../models/types';

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
            let projectResources: IResource[] = [];
            let projectEpics: IEpic[] = [];
            let projectTasks: ITask[] = [];

            if (projectPlan?.resources) {
                for (const resource of projectPlan.resources) {
                    const createdResource = new Resource({
                        title: resource.title,
                        project: projectName
                    });
                    await createdResource.save();
                    projectResources.push(createdResource._id);

                    if (resource.epics) {
                        for (const epic of resource.epics) {
                            const createdEpic = new Epic({
                                title: epic.title,
                                resource: createdResource._id,
                            });
                            await createdEpic.save();
                            projectEpics.push(createdEpic._id);

                            if (epic.tasks) {
                                for (const task of epic.tasks) {
                                    const createdTask = new Task({
                                        title: task.title,
                                        epic: createdEpic._id,
                                        estimateDaysToFinish: task.estimateDaysToFinish
                                    });
                                    await createdTask.save();
                                    projectTasks.push(createdTask._id);
                                }
                            }
                        }
                    }
                }
            }

            const project = await new Project({ 
                name: projectName, 
                description: projectDescription, 
                resources: projectResources, 
                prompt: req.body.summary,
                epics: projectEpics, 
                tasks: projectTasks, 
                userId: userId, 
            }).save();

            const populatedProject = await Project.findById(project._id)
            .populate({
                path: 'resources',
                model: 'Resource',
                populate: {
                    path: 'epics',
                    model: 'Epic',
                    populate: {
                        path: 'tasks',
                        model: 'Task'
                    }
                }
            })
            .exec();

        res.status(201).send(populatedProject);

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