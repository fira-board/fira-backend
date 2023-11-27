import Project from "../models/project";
import Resource from "../models/resource";
import Epic from "../models/epic";
import Task from "../models/task";
import { generateProjectPlan } from "../models/ai/project/ProjectPlanGenerator";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import projectUserRole from "../models/projectUserRoles";
import { fetchProject } from "../utility/referenceMapping";
import { ProjectPlan } from "../models/ai/project/ProjectPlanSchema";
import ProjectUserRoles from "../models/projectUserRoles";

export const listProjects = async (req: SessionRequest, res: Response) => {
  const projectIds = await projectUserRole
    .find({ userId: req.session!.getUserId() })
    .select("projectId")
    .lean();

  const projectIdsArray = projectIds.map((item) => item.projectId);

  let projects = await Project.find({ _id: { $in: projectIdsArray } });

  if (Number(req.query.fetch)) {
    const fetchedProjects = await Promise.all(projects.map(fetchProject));
    res.json(fetchedProjects);
  } else {
    res.json(projects);
  }
};

export const getProject = async (req: SessionRequest, res: Response) => {
  let project = await Project.findOne({
    _id: req.params.projectId,
    deleted: false,
  });

  if (!project) return res.status(404).send("Project not found");

  if (req.query.fetch)
    res.json(await fetchProject(project));
  else
    res.json(project);
};

export const createProject = async (req: SessionRequest, res: Response) => {
  const userId = req.session!.getUserId();

  let projectPlan = await generateProjectPlan(req.body.summary);
  const fetchProject = await saveToDatabase(projectPlan.data, userId);

  ProjectUserRoles.create({
    projectId: fetchProject._id,
    userId: userId,
    role: 3,
  });

  res.header("completion_tokens", projectPlan.usage.completion_tokens);
  res.header("prompt_tokens", projectPlan.usage.prompt_tokens);
  req.params.projectId = fetchProject._id;
  req.query.fetch = "1";

  res.json(getProject(req, res));

};

export const deleteProject = async (req: SessionRequest, res: Response) => {

  const deleted = await Project.findOneAndUpdate(
    { _id: req.params.id },
    { deleted: true }
  );

  await Epic.updateMany({ project: req.params.id }, { deleted: true });
  await Task.updateMany({ project: req.params.id }, { deleted: true });

  console.log("Project deleted successfully");

  res.json(deleted);
};

export const updateProject = async (req: SessionRequest, res: Response) => {
  const updatedData = {
    name: req.body.name,
    description: req.body.description,
  };

  const updated = await Project.updateOne(
    { _id: req.params.projectId, deleted: false },
    updatedData
  );

  if (!updated) {
    return res.status(404).send("Project not found");
  }

  console.log("Project updated successfully");
  res.json(updated);
};

const saveToDatabase = async (projectPlan: ProjectPlan, userId: string) => {
  let resouces = new Array();
  let epics = new Array();
  let tasks = new Array();

  const projectDocument = await new Project({
    name: projectPlan.name,
    description: projectPlan.description,
    prompt: projectPlan.description,
    resources: projectPlan.resources,
    userId: userId,
  }).save();

  for (const resource of projectPlan.resources) {
    const resourceDocument = await new Resource({
      title: resource.title,
      project: projectDocument._id,
      userId: userId,
    }).save();
    resouces.push(resourceDocument);

    const epicPromises = resource.epics.map(async (epic) => {
      const epicDocument = await new Epic({
        title: epic.title,
        resource: resourceDocument._id,
        project: projectDocument._id,
        userId: userId,
      }).save();
      epics.push(epicDocument);

      const taskPromises = epic.tasks.map(async (task) => {
        const taskDocument = await new Task({
          title: task.title,
          estimateDaysToFinish: task.estimateDaysToFinish,
          epic: epicDocument._id,
          resource: resourceDocument._id,
          project: projectDocument._id,
          userId: userId,
        }).save();
        tasks.push(taskDocument);
      });
      await Promise.all(taskPromises);
    });
    await Promise.all(epicPromises);
  }

  return projectDocument;
};
