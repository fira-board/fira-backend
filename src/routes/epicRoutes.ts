import express from "express";
import * as epicController from "../controllers/epicController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = express.Router();

router.get("/", verifySession(), asyncWrapper(epicController.listEpics));
router.get("/:id", verifySession(), asyncWrapper(epicController.listEpic));
router.post("/", verifySession(), asyncWrapper(epicController.createEpic));
router.delete("/:id", verifySession(), asyncWrapper(epicController.deleteEpic));
router.put("/:id", verifySession(), asyncWrapper(epicController.updateEpic));

export default router;
