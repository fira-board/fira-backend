import express from "express";
import * as taskController from "../controllers/taskController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import checkPermissions from "../middleware/projectUserRoles";
import asyncWrapper from "../utility/asyncWrapper";

const router = express.Router();

router.get("/projects/:projectId/tasks/", verifySession(), checkPermissions(1), asyncWrapper(taskController.listTasks));
router.get("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(1), asyncWrapper(taskController.getTask));
router.post("/projects/:projectId/tasks/", verifySession(), checkPermissions(2), asyncWrapper(taskController.createTask));
router.delete("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(2), asyncWrapper(taskController.deleteTask));
router.put("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(2), asyncWrapper(taskController.updateTask));

export default router;