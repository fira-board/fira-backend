import express from "express";
import * as taskController from "../controllers/taskController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import  checkPermissions  from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/projects/:projectId/tasks/", checkPermissions(1),verifySession(), taskController.listTasks);
router.get("/projects/:projectId/tasks/:id", checkPermissions(1),verifySession(), taskController.getTask);
router.post("/projects/:projectId/tasks/", checkPermissions(2),verifySession(), taskController.createTask);
router.delete("/projects/:projectId/tasks/:id", checkPermissions(2),verifySession(), taskController.deleteTask);
router.put("/projects/:projectId/tasks/:id", checkPermissions(2),verifySession(), taskController.updateTask);

export default router;