import Project from '../models/project';
import Task from '../models/task';
import Epic from '../models/epic';
import Resource from '../models/resource';
import { generateProjectPlan } from '../models/ai/ProjectPlanGenerator';
import { Request, Response } from 'express';
// import { ITask, IEpic, IResource, IProject } from '../models/types';

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
                            status: "Not Started",  // Assuming the initial status for a new task is "new"
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

            const savedProject = await new Project({
                name: projectPlan.projectName,
                description: projectPlan.description,
                prompt: req.body.summary,
                resources: resourceIds,
                userId: userId
            }).save();

            console.log(savedProject);
            // const savedProject = await new Project({ 
            //     name: projectName, 
            //     description: projectDescription,
            //     prompt: req.body.summary,
            //     userId: userId, 
            //     resources: 
            // }).save();

            // console.log(savedProject);
            // if (projectPlan?.resources) {
            //     savedProject.resources = [];
                
            //     for (const resourcePlan of projectPlan.resources) {
            //         const createdResource = await new Resource({
            //             title: resourcePlan.title,
            //             project: savedProject._id
            //         });
            //         await createdResource.save();
            //         const resourceObj = createdResource.toObject(); // Convert document to plain JS object
            //         resourceObj.epics = [];

            //         if (resourcePlan.epics) {
            //             for (const epicPlan of resourcePlan.epics) {
            //                 const createdEpic = await new Epic({
            //                     title: epicPlan.title,
            //                     resource: createdResource._id,
            //                 });
            //                 await createdEpic.save();
            //                 const epicObj = createdEpic.toObject(); // Convert document to plain JS object
            //                 epicObj.tasks = [];

            //                 if (epicPlan.tasks) {
            //                     for (const taskPlan of epicPlan.tasks) {
            //                         const createdTask = await new Task({
            //                             title: taskPlan.title,
            //                             epic: createdEpic._id,
            //                             estimateDaysToFinish: taskPlan.estimateDaysToFinish
            //                         });
            //                         await createdTask.save();
            //                         // Construct an object for the response
            //                         const taskResponseObj = {
            //                             _id: createdTask._id,
            //                             title: createdTask.title,
            //                             status: createdTask.status,
            //                             estimateDaysToFinish: createdTask.estimateDaysToFinish
            //                         };
            //                         epicObj.tasks.push(taskResponseObj);
            //                     }
            //                 }
            //                 const epicResponseObj = {
            //                     _id: createdEpic._id,
            //                     title: createdEpic.title,
            //                     tasks: epicObj.tasks // This already contains plain JS objects for tasks
            //                 };
            //                 resourceObj.epics.push(epicResponseObj);
            //             }
            //         }
            //         const resourceResponseObj = {
            //             _id: createdResource._id,
            //             title: createdResource.title,
            //             epics: resourceObj.epics  // This already contains plain JS objects for epics
            //         };
            //         savedProject.resources.push(resourceResponseObj);                    
            //     }
            // }

            return res.json(projectPlan);  // Return the nested project structure

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