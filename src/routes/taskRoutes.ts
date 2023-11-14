import express from "express";
import * as taskController from "../controllers/taskController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import  checkPermissions  from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/", checkPermissions(1),verifySession(), asyncWrapper(taskController.listTasks));
router.get("/:id", checkPermissions(1),verifySession(), asyncWrapper(taskController.getTask));
router.post("/", checkPermissions(2),verifySession(), asyncWrapper(taskController.createTask));
router.delete("/:id", checkPermissions(2),verifySession(), asyncWrapper(taskController.deleteTask));
router.put("/:id", checkPermissions(2),verifySession(), asyncWrapper(taskController.updateTask));

export default router;
