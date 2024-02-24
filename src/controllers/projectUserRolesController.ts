import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import ProjectUserRoles from "../models/projectUserRoles";
import supertokens from "supertokens-node";
import UserData from "../models/userData";
import { sendInvite } from "../services/emailService";
import Project from "../models/project";

export const getUserRoles = async (req: SessionRequest, res: Response) => {
  try {
    const userRoles = await ProjectUserRoles.find({ projectId: req.params.projectId });
    let response = [];

    for (const userRole of userRoles) {
      const userData = await UserData.find({ userId: userRole.userId });

      // Combine userRole and userData into a single object
      response.push({
        userRole: userRole,
        userData: userData
      });
    }

    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteUserRoles = async (req: SessionRequest, res: Response) => {
  try {

    const userRole = await ProjectUserRoles.findOne({
      projectId: req.params.projectId,
      _id: req.params.userRoleId
    });

    if (!userRole) {
      res.status(404).send("User Role Not Found");
    }

    // Check for role 3 and count conditions
    if (userRole!.role === 3) {
      const count = await ProjectUserRoles.countDocuments({
        projectId: req.params.projectId,
        role: 3,
      });

      // Disallow deletion if this is the only user with role 3
      if (count <= 1) {
        res.status(403).send("Cannot delete the only owner of the project");
      }
    }

    // Perform deletion if allowed
    const deletedUserRoles = await ProjectUserRoles.deleteOne({
      projectId: req.params.projectId,
      _id: req.params.userRoleId,
    });
    res.json(deletedUserRoles);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const addUserRoles = async (req: SessionRequest, res: Response) => {
  const roles = req.body.roles;
  const userId = req.session!.getUserId();
  const project = await Project.findById(req.params.projectId);
  const userData = await UserData.findOne({ userId: userId });

  if (!project) {
    return res.status(404).send("Project Not Found");
  }
  if (!userData) {
    return res.status(404).send("User Not Found");
  }

  const response = await Promise.all(roles.map(async (role: any) => {
    let usersInfo = await supertokens.listUsersByAccountInfo("public", {
      email: role.email,
    });

    if (usersInfo.length > 0) {

      const userProjectRole = await ProjectUserRoles.findOne({
        projectId: req.params.projectId,
        userId: usersInfo[0].id,
      });

      if (userProjectRole)
        return {
          response: "HAS_ROLE",
          id: role.userId,
        };

      await ProjectUserRoles.create({
        projectId: req.params.projectId,
        userId: usersInfo[0].id,
        role: role.role,
      });
      return {
        response: "ADDED",
        id: role.userId,
      };

    } else {
      console.log("sending invite by : ", userId);
      sendInvite(userData!.name, project!.name, role.email);
      return {
        response: "EMAIL_SENT",
        id: role.email,
      };
    }
  }));

  res.status(200).send(response);
};
