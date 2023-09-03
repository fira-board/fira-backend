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
            let projectPlan = await generateProjectPlan(req.body.summary);
            let resourceIds: any[] = [];
            let epicIds: any[] = [];
            let taskIds: any[] = [];

            // 1. Create the project to get the projectId
            const project = new Project({
                name: projectPlan.projectName,
                description: projectPlan.description,
                prompt: req.body.summary,
                userId: userId
            });
            const projectId = project._id;

            await Promise.all(projectPlan.resources.map(async (resource, rIndex) => {
                let resourceEpics: any[] = [];
                const newResource = new Resource({
                    title: resource.title,
                    project: projectId
                });

                await Promise.all(resource.epics.map(async (epic, eIndex) => {
                    let epicTasks: any[] = [];
                    const newEpic = new Epic({
                        title: epic.title,
                        resource: newResource._id,
                        project: projectId
                    });
                    epicIds.push(newEpic._id);
                    resourceEpics.push(newEpic._id);

                    await Promise.all(epic.tasks.map(async (task, tIndex) => {
                        const newTask = new Task({
                            title: task.title,
                            status: "Not Started",
                            estimateDaysToFinish: task.estimateDaysToFinish,
                            epic: newEpic._id,
                            project: projectId
                        });
                        taskIds.push(newTask._id);
                        epicTasks.push(newTask._id);
                        (projectPlan.resources[rIndex].epics[eIndex].tasks[tIndex] as any)._id = newTask._id;
                        
                        // Save the task
                        await newTask.save();
                    }));

                    // Save the epic
                    newEpic.tasks = epicTasks;
                    await newEpic.save();
                }));

                // Save the resource
                newResource.epics = resourceEpics;
                await newResource.save();
                resourceIds.push(newResource._id);
                (projectPlan.resources[rIndex] as any)._id = newResource._id;
            }));

            // Save the project with the resourceIds, epicIds, and taskIds
            project.resources = resourceIds;
            project.epics = epicIds;
            project.tasks = taskIds;
            await project.save();

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