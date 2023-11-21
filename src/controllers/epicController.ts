import Epic from "../models/epic";
import Task from "../models/task";
import { fetchEpic } from "../utility/referenceMapping";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

export const listEpics = async (req: SessionRequest, res: Response) => {
  const query: any = req.query;
  const fetch = req.query.fetch;

  query.project = req.params.projectId;
  query.deleted = false;

  let epics = await Epic.find(query).lean();

  if (fetch)
    res.json(epics.map(async (epic) => await fetchEpic(epic)));
  else
    res.json(epics);

};

export const createEpic = async (req: SessionRequest, res: Response) => {
  const userId = req.session!.getUserId();


  const newEpic = new Epic({
    title: req.body.title,
    status: req.body.status,
    resource: req.body.resourceId,
    project: req.params.projectId,
    userId: userId,
  });

  await newEpic.save();

  res.json(newEpic._id);
};

export const listEpic = async (req: SessionRequest, res: Response) => {

  let epic = await Epic.findOne({
    _id: req.params.id,
    project: req.params.projectId,
    deleted: false,
  }).lean();

  if (!epic) {
    return res.status(404).send("Epic not found or marked as deleted");
  }

  const fetch = Number(req.query.fetch);

  if (fetch)
    res.json(await fetchEpic(epic));
  else
    res.json(epic);
};

export const deleteEpic = async (req: SessionRequest, res: Response) => {

  // Mark epic as deleted
  const deleted = await Epic.findOneAndUpdate(
    { _id: req.params.id, project: req.params.projectId },
    { deleted: true }
  ).lean();

  if (!deleted) {
    return res.status(404).send("Epic not found");
  }

  // Delete tasks within the epic in project, mark tasks as deleted
  await Task.updateMany(
    { epic: req.params.id },
    {
      deleted: true,
    }
  );

  console.log("Epic deleted successfully");
  res.json(deleted);
};

export const updateEpic = async (req: SessionRequest, res: Response) => {
  const updatedData = {
    title: req.body.title,
    status: req.body.status,
    resource: req.body.resourceId,
    tasks: req.body.tasks,
    order: req.body.order,
  };
  const updated = await Epic.findOneAndUpdate(
    { _id: req.params.id, project: req.params.projectId, deleted: false }, updatedData
  ).lean();

  if (!updated) 
    return res.status(404).send("Epic not found");
  
  res.json(updated);
};
