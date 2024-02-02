import { Response, NextFunction } from 'express';
import { SessionRequest } from "supertokens-node/framework/express";
import ProjectUserRoles from "../models/projectUserRoles";

function checkPermissions(requiredRole: number) {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    const userId = req.session!.getUserId();
    const projectId = req.params.projectId;

    const userRole = await ProjectUserRoles.findOne({ userId, projectId });

    if (!userRole || userRole.role < requiredRole) {
      return res.status(403).send('Insufficient permissions');
    }
    next();
  }
}
export default checkPermissions;
