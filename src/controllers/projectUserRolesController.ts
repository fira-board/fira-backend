import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import ProjectUserRoles from "../models/ProjectUserRoles";
import { getUserByEmail } from "supertokens-node/recipe/emailpassword";
import { TypeEmailPasswordUser } from "supertokens-node/recipe/emailpassword/types";

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
    roles.array.forEach((userRole) => {
      const user: TypeEmailPasswordUser | undefined = await getUserByEmail(
        email
      );

      if (user) {
        const userRoles = await ProjectUserRoles.create({
          projectId: req.params.projectId,
          userId: user.id,
          role: userRole.role,
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
