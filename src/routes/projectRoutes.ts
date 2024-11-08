import promiseRouter from 'express-promise-router';
import * as projectController from "../controllers/projectController";
import * as projectUserRolesController from "../controllers/projectUserRolesController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware';
import checkPermissions from "../middleware/projectUserRoles";

const router = promiseRouter();

// Project CRUD operations
router.get("/", verifySession(), projectController.listProjects);
router.post("/", verifySession(), checkUserTokens, subtractUserTokens(projectController.createProject));

// Specific route should come before general :projectId route
router.get("/progress", verifySession(), projectController.getAllProjectsProgress);

// Now the general :projectId routes
router.get("/:projectId", verifySession(), checkPermissions(1), projectController.getProject);
router.get("/:projectId/progress", verifySession(), checkPermissions(1), projectController.getProjectProgress);
router.delete("/:projectId", verifySession(), checkPermissions(3), projectController.deleteProject);
router.put("/:projectId", verifySession(), checkPermissions(3), projectController.updateProject);

// Project User Roles
router.get("/:projectId/userRoles", verifySession(), checkPermissions(1), projectUserRolesController.getUserRoles);
router.put("/:projectId/userRoles", verifySession(), checkPermissions(3), projectUserRolesController.addUserRoles);
router.delete("/:projectId/userRoles/:userRoleId", verifySession(), checkPermissions(3), projectUserRolesController.deleteUserRoles);

export default router;
