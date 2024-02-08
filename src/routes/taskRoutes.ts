import express from "express";
import * as taskController from "../controllers/taskController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import checkPermissions from "../middleware/projectUserRoles";
import trackActivity from "../middleware/activityMiddleware"
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware';
import { ITEM_CREATE, ITEM_EDIT, ITEM_DELETE } from "../models/activity"

const router = express.Router();

router.get("/projects/:projectId/tasks/", verifySession(), checkPermissions(1), taskController.listTasks);
router.get("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(1), taskController.getTask);
router.post("/projects/:projectId/tasks/", verifySession(), checkPermissions(2), trackActivity(ITEM_CREATE, "task"), taskController.createTask);
router.delete("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(2), trackActivity(ITEM_DELETE, "task"), taskController.deleteTask);
router.put("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(2), trackActivity(ITEM_EDIT, "task"), taskController.updateTask);

// Generate task description
router.get("/projects/:projectId/tasks/:id/description", verifySession(), checkPermissions(2), checkUserTokens, subtractUserTokens(taskController.generateDescription));

export default router;