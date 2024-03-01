import Project, { IProject } from "../models/project";
import Resource from "../models/resource";
import Epic from "../models/epic";
import Task from "../models/task";
import { generateProjectPlan } from "../models/ai/project/ProjectPlanGenerator";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import projectUserRole from "../models/projectUserRoles";
import { ProjectPlan } from "../models/ai/project/ProjectPlanSchema";
import ProjectUserRoles from "../models/projectUserRoles";
import mongoose from "mongoose";
import { SYSTEM_TO_DO, SYSTEM_IN_PROGRESS, SYSTEM_DONE } from "../models/status";

export const listProjects = async (req: SessionRequest, res: Response) => {
  const fetchTasks = req.query.fetch === 'true';
  const includeDeleted = req.query.includeDeleted === 'true';
  const projectIds = await projectUserRole
    .find({ userId: req.session!.getUserId(), projectIsDeleted: false })
    .select("projectId")
    .lean();


  const projectIdsArray = projectIds.map((item) => item.projectId);

  let query: mongoose.Query<IProject[], IProject> = Project.find({ _id: { $in: projectIdsArray }, deleted: includeDeleted });

  if (fetchTasks) {
    if (includeDeleted) {
      query = queryDeletedPopulatedProjects(query)
    } else {
      query = queryPopulatedProjects(query)
    }
  }

  const projects = await query.exec();
  res.json(projects);
};

export const getProject = async (req: SessionRequest, res: Response) => {
  const id = req.params.projectId;
  const fetchTasks = req.query.fetch === 'true';
  const includeDeleted = req.query.includeDeleted === 'true';


  let query: mongoose.Query<IProject | null, IProject> = Project.findById(id).where('deleted').equals(includeDeleted).populate('statuses');

  if (fetchTasks) {
    if (includeDeleted) {
      query = queryDeletedProject(query);
    } else {
      query = queryProject(query);
    }
  }

  const project = await query.exec();

  if (!project) {
    return res.status(404).send('Project not found or has been deleted');
  }
  res.json(project);
};

export const createProject = async (req: SessionRequest, res: Response) => {
  const userId = req.session!.getUserId();
  const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
  const model = req.model || '';

  startDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000

  let projectPlan = await generateProjectPlan(req.body.summary, model);
  const project = await saveToDatabase(projectPlan.data, userId, startDate);

  await ProjectUserRoles.create({
    projectId: project._id,
    userId: userId,
    role: 3,
  });

  res.header("completion_tokens", projectPlan.usage.completion_tokens);
  res.header("prompt_tokens", projectPlan.usage.prompt_tokens);

  res.json(project);
};

export const deleteProject = async (req: SessionRequest, res: Response) => {
  const projectId = req.params.projectId;

  const deleted = await Project.findOneAndUpdate(
    { _id: projectId, deleted: false },
    { deleted: true }
  ).lean();


  if (!deleted) {
    return res.status(404).send("Project not found");
  }

  await Epic.updateMany({ project: projectId }, { deleted: true });
  await Task.updateMany({ project: projectId }, { deleted: true });
  await ProjectUserRoles.updateMany({ projectId: projectId }, { projectIsDeleted: true });

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
  ).lean();

  if (!updated) {
    return res.status(404).send("Project not found");
  }

  console.log("Project updated successfully");
  res.json(updated);
};

export const getAllProjectsProgress = async (req: SessionRequest, res: Response) => {
  const userId = req.session!.getUserId();

  const result = await Task.aggregate([
    {
      $match: {
        deleted: false,
        userId: userId
      }
    },
    {
      $group: {
        _id: '$project', // Group by project
        totalTasksCount: { $sum: 1 },
        doneTasksCount: {
          $sum: {
            $cond: [{ $eq: ["$status", new mongoose.Types.ObjectId(SYSTEM_DONE)] }, 1, 0]
          }
        }
      }
    },
    {
      $lookup: { 
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'projectDetails'
      }
    },
    {
      $project: { // Format the output
        _id: 0,
        project: '$_id',
        projectDetails: { $arrayElemAt: ['$projectDetails', 0] }, // Flatten the project details
        progress: {
          $cond: [{ $gt: ['$totalTasksCount', 0] }, { $multiply: [{ $divide: ['$doneTasksCount', '$totalTasksCount'] }, 100] }, 0]
        },
        doneTasksCount: 1,
        totalTasksCount: 1
      }
    }
  ]);

  // Format the results for response
  const projectsProgress = result.map(item => ({
    projectId: item.project,
    projectName: item.projectDetails ? item.projectDetails.name : "Unknown",
    progress: item.progress.toFixed(2) + '%',
    doneTasksCount: item.doneTasksCount,
    totalTasksCount: item.totalTasksCount
  }));

  res.json(projectsProgress);
};

export const getProjectProgress = async (req: SessionRequest, res: Response) => {

  const projectId = req.params.projectId;

  const result = await Task.aggregate([
    {
      $match: {
        deleted: false,
        project: new mongoose.Types.ObjectId(projectId)
      }
    },
    {
      $group: {
        _id: null, // Grouping key - null means group all
        totalTasksCount: { $sum: 1 }, // Count the number "1"
        doneTasksCount: {
          $sum: {
            $cond: [{ $eq: ["$status",  new mongoose.Types.ObjectId(SYSTEM_DONE)] }, 1, 0] // Count only done tasks by giving it "1" and "0" to anything else
          }
        }
      }
    }
  ]);

  let progress, doneTasksCount, totalTasksCount;

  // Check if we got results
  if (result.length > 0) {
    doneTasksCount = result[0].doneTasksCount;
    totalTasksCount = result[0].totalTasksCount;
    progress = totalTasksCount > 0 ? (doneTasksCount / totalTasksCount) * 100 : 0;
  } else {
    // Default to 0 if no tasks found
    progress = 0;
    doneTasksCount = 0;
    totalTasksCount = 0;
  }

  res.json({
    projectId,
    progress: progress.toFixed(2) + '%', // Format as a string with 2 decimal places
    doneTasksCount,
    totalTasksCount
  });
};

const saveToDatabase = async (projectPlan: ProjectPlan, userId: string, projectStartDate: Date) => {
  let resouces = new Array();
  let epics = new Array();
  let tasks = new Array();

  const projectDocument = await new Project({
    name: projectPlan.name,
    description: projectPlan.description,
    prompt: projectPlan.description,
    statuses: [SYSTEM_TO_DO, SYSTEM_IN_PROGRESS, SYSTEM_DONE],
    userId: userId,
    startDate: projectStartDate
  }).save();

  for (const resource of projectPlan.resources) {
    const resourceDocument = await new Resource({
      title: resource.title,
      project: projectDocument._id,
      userId: userId,
    }).save();
    resouces.push(resourceDocument);

    let taskTimeline = new Date(projectStartDate);

    const epicPromises = resource.epics.map(async (epic) => {
      const epicDocument = await new Epic({
        title: epic.title,
        resource: resourceDocument._id,
        project: projectDocument._id,
        userId: userId,
        status: SYSTEM_TO_DO
      }).save();
      epics.push(epicDocument);

      const taskPromises = epic.tasks.map(async (task) => {
        const taskDocument = await new Task({
          title: task.title,
          environmentalImpact: task.environmentalImpact,
          socialImpact: task.socialImpact,
          estimateDaysToFinish: task.estimateDaysToFinish,
          epic: epicDocument._id,
          startDate: new Date(taskTimeline),
          endDate: new Date(taskTimeline.setDate(taskTimeline.getDate() + task.estimateDaysToFinish)),
          resource: resourceDocument._id,
          project: projectDocument._id,
          userId: userId,
          status: SYSTEM_TO_DO
        }).save();

        tasks.push(taskDocument);
        epicDocument.tasks.push(taskDocument._id);
      });

      await Promise.all(taskPromises);
      epicDocument.save();
    });
    await Promise.all(epicPromises);
  }
  projectDocument.epics.push(...epics.map((epic) => epic._id));

  return projectDocument.save();
};

function queryProject(query: mongoose.Query<IProject | null, IProject, {}, IProject, "find">) {
  return query.populate(
    {
      path: 'epics', model: "epic", populate: [
        {
          path: "resource",
          model: "resource"

        },
        {
          path: "tasks",
          model: "task",
          match: { deleted: false }
        }
      ],
    }
  );
}

function queryDeletedProject(query: mongoose.Query<IProject | null, IProject, {}, IProject, "find">): mongoose.Query<IProject | null, IProject, {}, IProject, "find"> {
  //has no deleted flag so populate all
  return query.populate(
    {
      path: 'epics', model: "epic", populate: [
        {
          path: "resource",
          model: "resource",
        },
        {
          path: "tasks",
          model: "task",
        },
        {
          path: "status",
          model: "status",
        }
      ],
    }
  );
}

function queryPopulatedProjects(query: mongoose.Query<IProject[], IProject, {}, IProject, "find">): mongoose.Query<IProject[], IProject, {}, IProject, "find"> {
  return query.populate(
    {
      path: 'epics', model: "epic", populate: [
        {
          path: "resource",
          model: "resource",
        },
        {
          path: "tasks",
          model: "task",
          match: { deleted: false }
        },
        {
          path: "status",
          model: "status",
        }
      ],
      match: { deleted: false }
    }
  );
}

function queryDeletedPopulatedProjects(query: mongoose.Query<IProject[], IProject, {}, IProject, "find">): mongoose.Query<IProject[], IProject, {}, IProject, "find"> {
  //has no deleted flag so populate all
  return query.populate(
    {
      path: 'epics', model: "epic", populate: [
        {
          path: "resource",
          model: "resource",
        },
        {
          path: "tasks",
          model: "task",
        }
      ]
    }
  );
}