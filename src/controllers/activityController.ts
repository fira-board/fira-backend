import Activity from "../models/activity";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";


export const listActivity = async (req: SessionRequest, res: Response) => {
  const page = Number(req.query.page as string) || 0;
  const pageSize = Number(req.query.pageSize) || 10;

  // Find activities for the project with pagination
  const activities = await Activity.find({ projectId: req.params.projectId }, null, { skip: page * pageSize, limit: pageSize });

  res.json(activities);
};