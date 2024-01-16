import express from "express";
import * as projectController from "../controllers/projectController";
import * as projectUserRolesController from "../controllers/projectUserRolesController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware';
import checkPermissions from "../middleware/projectUserRoles";
import asyncWrapper from "../utility/asyncWrapper";



const router = express.Router();

//Project CRUD operations
router.get("/", verifySession(), asyncWrapper(projectController.listProjects));
router.get("/:projectId", verifySession(), checkPermissions(1), asyncWrapper(projectController.getProject));
router.post("/", verifySession(), checkUserTokens, asyncWrapper(subtractUserTokens(projectController.createProject)));
router.delete("/:projectId", verifySession(), checkPermissions(3), asyncWrapper(projectController.deleteProject));
router.put("/:projectId", verifySession(), checkPermissions(3), asyncWrapper(projectController.updateProject));

//Project User Roles
router.get("/:projectId/userRoles", verifySession(), checkPermissions(1), asyncWrapper(projectUserRolesController.getUserRoles));
router.put("/:projectId/userRoles", verifySession(), checkPermissions(3), asyncWrapper(projectUserRolesController.addUserRoles));
router.delete("/:projectId/userRoles/:userRoleId", verifySession(), checkPermissions(3), asyncWrapper(projectUserRolesController.deleteUserRoles));

export default router;
