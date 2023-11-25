import express from "express";
import * as projectController from "../controllers/projectController";
import * as projectUserRolesController from "../controllers/projectUserRolesController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware'; // Import the middleware
import checkPermissions from "../middleware/projectUserRoles";



const router = express.Router();

//Project CRUD operations
router.get("/", verifySession(), projectController.listProjects);
router.get("/:projectId", verifySession(), checkPermissions(1), projectController.getProject);
router.post("/", verifySession(), checkUserTokens, subtractUserTokens(projectController.createProject));
router.delete("/:projectId", verifySession(), checkPermissions(3), projectController.deleteProject);
router.put("/:projectId", verifySession(), checkPermissions(3), projectController.updateProject);

//Project User Roles
router.get("/:projectId/userRoles", verifySession(), checkPermissions(1), projectUserRolesController.getUserRoles);
router.put("/:projectId/userRoles", verifySession(), checkPermissions(3), projectUserRolesController.addUserRoles);
router.delete("/:projectId/userRoles/:userRoleId", verifySession(), checkPermissions(3), projectUserRolesController.deleteUserRoles);


export default router;
