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

    roles.array.forEach(async (role: any) => {

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
