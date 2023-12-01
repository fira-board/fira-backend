import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import ProjectUserRoles from "../models/projectUserRoles";
import supertokens from "supertokens-node";

export const getUserRoles = async (req: SessionRequest, res: Response) => {
  try {
    const userRoles = await ProjectUserRoles.find({
      projectId: req.params.projectId,
    });
    res.json(userRoles);
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
  try {
    const roles = req.body.roles;

    roles.forEach(async (role: any) => {
      let usersInfo = await supertokens.listUsersByAccountInfo("public", {
        email: role.email,
      });

      if (usersInfo.length > 0) {
        await ProjectUserRoles.create({
          projectId: req.params.projectId,
          userId: usersInfo[0].id,
          role: role.role,
        });
      } else {
        // TODO: send email invite
      }
    });

    res.status(201).send();
  } catch (err) {
    res.status(500).send(err);
  }
};
