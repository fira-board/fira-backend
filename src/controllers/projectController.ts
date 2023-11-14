import Project from "../models/project";
import Task from "../models/task";
import Epic from "../models/epic";
import Resource from "../models/resource";
import fetchWithReferences from "../utility/referenceMapping";
import { IProject, IResource, IEpic, ITask } from "../models/types";
import { generateProjectPlan } from "../models/ai/project/ProjectPlanGenerator";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { Types, Document } from "mongoose";
import { validateParameter } from "../utility/utils";


export const listProjects = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    let projects = await Project.find({ userId: userId });

    const fetch = Number(req.query.fetch);
    if (fetch) {
      validateParameter(fetch, "Fetch", ["inRange"], res, ["0", "1"]);
      projects = await fetchWithReferences(projects, "project");
    }

    res.json(projects);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createProject = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    if (req.params.empty) {
      res.status(201).send(await new Project(req.body).save());
    } else {
      let projectPlan = await generateProjectPlan(req.body.summary);
      let resourceIds: Types.ObjectId[] = [];
      let epicIds: Types.ObjectId[] = [];
      let taskIds: Types.ObjectId[] = [];

      const project = new Project({
        name: projectPlan.projectName,
        description: projectPlan.description,
        prompt: req.body.summary,
        userId: userId,
      }) as IProject & Document;
      const projectId = project._id;
      projectPlan.projectId = projectId;

      await Promise.all(
        projectPlan.resources.map(async (resource, rIndex) => {
          let resourceEpics: Types.ObjectId[] = [];
          let resourceTasks: Types.ObjectId[] = [];
          const newResource = new Resource({
            title: resource.title,
            project: projectId,
            userId: userId,
          }) as IResource & Document;

          await Promise.all(
            resource.epics.map(async (epic, eIndex) => {
              let epicTasks: Types.ObjectId[] = [];
              const newEpic = new Epic({
                title: epic.title,
                resource: newResource._id,
                project: projectId,
                userId: userId,
                deleted: false,
                order: epic.order,
              }) as IEpic & Document;
              epicIds.push(newEpic._id);
              resourceEpics.push(newEpic._id);
              (projectPlan.resources[rIndex].epics[eIndex] as any)._id =
                newEpic._id;

              await Promise.all(
                epic.tasks.map(async (task, tIndex) => {
                  const newTask = new Task({
                    title: task.title,
                    userId: userId,
                    status: "Not Started",
                    estimateDaysToFinish: task.estimateDaysToFinish,
                    epic: newEpic._id,
                    resource: newResource._id,
                    project: projectId,
                    deleted: false,
                    order: task.order,
                  }) as ITask & Document;
                  taskIds.push(newTask._id);
                  epicTasks.push(newTask._id);
                  resourceTasks.push(newTask._id);
                  (
                    projectPlan.resources[rIndex].epics[eIndex].tasks[
                      tIndex
                    ] as any
                  )._id = newTask._id;

                  // Save the task
                  await newTask.save();
                })
              );

              // Save the epic
              newEpic.tasks = epicTasks;
              await newEpic.save();
            })
          );

          // Save the resource
          newResource.epics = resourceEpics;
          newResource.tasks = resourceTasks;
          await newResource.save();
          resourceIds.push(newResource._id);
          (projectPlan.resources[rIndex] as any)._id = newResource._id;
        })
      );

      // Save the project with the resourceIds, epicIds, and taskIds
      project.resources = resourceIds;
      project.epics = epicIds;
      project.tasks = taskIds;
      await project.save();

      return res.json(projectPlan);
    }
  } catch (err) {
    console.error("Error in createProject:", err);
    res.status(500).send("Internal Server Error");
  }
};

export const getProject = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    validateParameter(req.params.projectId, "Project ID", ["required", "string"], res);

    let project = await Project.findOne({ _id: req.params.projectId, userId: userId });

    if (!project) {
      return res.status(404).send("Project not found");
    }

    const fetch = Number(req.query.fetch);
    if (fetch) {
      validateParameter(fetch, "Fetch", ["inRange"], res, ["0", "1"]);
      project = await fetchWithReferences(project, "project");
    }

    console.log("Project found");
    res.json(project);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteProject = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    validateParameter(req.params.projectId, "Project ID", ["required", "string"], res);

    const deleted = await Project.deleteOne({
      _id: req.params.projectId,
      userId: userId,
    });
    console.log("Project deleted successfully");
    res.json(deleted);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateProject = async (req: SessionRequest, res: Response) => {
  const userId = req.session!.getUserId();

  if (userId === undefined) {
    res.status(401).send("Unauthorized");
  }

  validateParameter(req.params.projectId, "Project ID", ["required", "string"], res);

  try {
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      prompt: req.body.description,
      resources: req.body.resources,
    };
    const updated = await Project.updateOne(
      { _id: req.params.projectId, userId: userId },
      updatedData
    );

    if (!updated) {
      return res.status(404).send("Project not found");
    }

    console.log("Project updated successfully");
    res.json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
};
