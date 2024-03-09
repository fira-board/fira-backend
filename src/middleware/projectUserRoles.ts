import { Response, NextFunction } from 'express';
import { SessionRequest } from "supertokens-node/framework/express";
import ProjectUserRoles from "../models/projectUserRoles";
import mongoose from 'mongoose';


function checkPermissions(requiredRole: number) {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    const userId = req.session!.getUserId();
    const projectId = req.params.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send('Invalid projectId');
    }
    
    const userRole = await ProjectUserRoles.findOne({ userId, projectId });

    if (!userRole || userRole.role < requiredRole) {
      return res.status(403).send('Insufficient permissions');
    }
    next();
  }
}
export default checkPermissions;
