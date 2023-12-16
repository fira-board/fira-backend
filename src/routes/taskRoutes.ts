import express from "express";
import * as taskController from "../controllers/taskController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import checkPermissions from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/projects/:projectId/tasks/", verifySession(), checkPermissions(1), taskController.listTasks);
router.get("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(1), taskController.getTask);
router.post("/projects/:projectId/tasks/", verifySession(), checkPermissions(2), taskController.createTask);
router.delete("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(2), taskController.deleteTask);
router.put("/projects/:projectId/tasks/:id", verifySession(), checkPermissions(2), taskController.updateTask);

export default router;