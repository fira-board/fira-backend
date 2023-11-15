import express from "express";
import * as projectController from "../controllers/projectController";
import * as projectUserRolesController from "../controllers/projectUserRolesController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware'; // Import the middleware
import  checkPermissions  from "../middleware/projectUserRoles";



const router = express.Router();

router.get("/", verifySession(), asyncWrapper(projectController.listProjects));
router.get("/:projectId", verifySession(),checkPermissions(1), asyncWrapper(projectController.getProject));
router.post("/", verifySession(), checkUserTokens, subtractUserTokens, asyncWrapper(projectController.createProject));
router.delete("/:projectId", verifySession(),checkPermissions(3), asyncWrapper(projectController.deleteProject));
router.put("/:projectId", verifySession(),checkPermissions(3), asyncWrapper(projectController.updateProject));
router.get("/:projectId/userRoles", verifySession(),checkPermissions(1), asyncWrapper(projectUserRolesController.getProject));
router.put("/:projectId/userRoles", verifySession(),checkPermissions(3), asyncWrapper(projectUserRolesController.getProject));
router.delete("/:projectId/userRoles/:userRoleId", verifySession(),checkPermissions(3), asyncWrapper(projectUserRolesController.deleteProject));


export default router;
