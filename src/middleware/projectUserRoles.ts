import { Response, NextFunction } from 'express';
import { SessionRequest } from "supertokens-node/framework/express";
import ProjectUserRoles from "../models/projectUserRoles";

function checkPermissions(requiredRole: number) {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.session!.getUserId(); // or however you retrieve the userId
      const projectId = req.params.projectId; // or however you retrieve the projectId

      const userRole = await ProjectUserRoles.findOne({ userId, projectId});

      if (!userRole || userRole.role < requiredRole) {
        return res.status(403).send('Insufficient permissions');
      }

      next();
    } catch (error) {
      res.status(500).send('Server error');
    }
  };
}

export default checkPermissions;
