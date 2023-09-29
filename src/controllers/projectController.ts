import Project from "../models/project";
import Task from "../models/task";
import Epic from "../models/epic";
import Resource from "../models/resource";
import fetchWithReferences from "../utility/referenceMapping"
import { generateProjectPlan } from "../models/ai/project/ProjectPlanGenerator";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";


export const listProjects = async (req: SessionRequest, res: Response) => {
  try {
    const userId = req.session!.getUserId();

    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    let projects = await Project.find();

    if (req.query.fetch) {
      projects = await fetchWithReferences(projects, "project");
    }

    res.json(projects);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createProject = async (req: SessionRequest, res: Response) => {
  try {
    const userId = "uuid21312321";
    if (userId === undefined) {
      res.status(401).send("Unauthorized");
    }

    if (req.params.empty) {
      res.status(201).send(await new Project(req.body).save());
    } else {
      let projectPlan = await generateProjectPlan(req.body.summary);
      let resourceIds: any[] = [];
      let epicIds: any[] = [];
      let taskIds: any[] = [];

      const project = new Project({
        name: projectPlan.projectName,
        description: projectPlan.description,
        prompt: req.body.summary,
        userId: userId,
      });
      const projectId = project._id;

      await Promise.all(
        projectPlan.resources.map(async (resource, rIndex) => {
          let resourceEpics: any[] = [];
          let resourceTasks: any[] = [];
          const newResource = new Resource({
            title: resource.title,
            project: projectId,
            userId: userId,
          });

          await Promise.all(
            resource.epics.map(async (epic, eIndex) => {
              let epicTasks: any[] = [];
              const newEpic = new Epic({
                title: epic.title,
                resource: newResource._id,
                project: projectId,
                userId: userId,
                deleted: false,
              });
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
                  });
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

    let project = await Project.findOne({ _id: req.params.id, userId: userId });

    if (!project) {
      return res.status(404).send("Project not found");
    }

    if (req.query.fetch) {
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

    const deleted = await Project.deleteOne({ _id: req.params.id, userId: userId });
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

  try {
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      prompt: req.body.description,
      resources: req.body.resources,
    };
    const updated = await Project.updateOne(
      { _id: req.params.id, userId: userId },
      updatedData
    );
    console.log("Project updated successfully");
    res.json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
};
