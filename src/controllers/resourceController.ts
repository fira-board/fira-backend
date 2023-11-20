import Resource from "../models/resource";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

export const listResources = async (req: SessionRequest, res: Response) => {
  const query = req.params.query || "";  // default to empty query;
  const page = Number(req.query.page) || 0; // default to first page
  const pageSize = Number(req.query.pageSize) || 10; // default to 10 items per page

  //search for resource by title where the title starts with the query
  let resources = await Resource.find({ title: { $regex: `^${query}`, $options: "i" } }, null, { skip: page * pageSize, limit: pageSize }).lean();

  console.debug("Resources search");
  res.json(resources);
};


export const getResource = async (req: SessionRequest, res: Response) => {
  let resource = await Resource.findOne({
    _id: req.params.id,
  });

  if (!resource) {
    return res.status(404).send("Resource not found");
  }

  console.debug("Resource found");
  res.json(resource);
};


export const createResource = async (req: SessionRequest, res: Response) => {
  const userId = req.session!.getUserId();

  const newResource = new Resource({
    title: req.body.title,
    project: req.body.projectId,
    userId: userId,
  });

  await newResource.save();

  console.debug("Resource created successfully");
  res.json(newResource._id);
};
