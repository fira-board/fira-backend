import express from "express";
import * as taskController from "../controllers/taskController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = express.Router();

router.get("/", verifySession(), asyncWrapper(taskController.listTasks));
router.get("/:id", verifySession(), asyncWrapper(taskController.getTask));
router.post("/", verifySession(), asyncWrapper(taskController.createTask));
router.delete("/:id", verifySession(), asyncWrapper(taskController.deleteTask));
router.put("/:id", verifySession(), asyncWrapper(taskController.updateTask));

// ... You can add more routes for update, delete, and add contributors.

export default router;
