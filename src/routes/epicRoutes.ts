import express from "express";
import * as epicController from "../controllers/epicController";
import { asyncWrapper } from "../asyncWrapper";

const router = express.Router();

router.get("/", asyncWrapper(epicController.listEpics));
router.get("/:id", asyncWrapper(epicController.listEpic));
router.post("/", asyncWrapper(epicController.createEpic));
router.delete("/:id", asyncWrapper(epicController.deleteEpic));
router.put("/:id", asyncWrapper(epicController.updateEpic));

// ... You can add more routes for update, delete, and add contributors.

export default router;
