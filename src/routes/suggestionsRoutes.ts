import express from "express";
import * as suggestionsController from "../controllers/suggestionsController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = express.Router();

router.get("/epic", verifySession(), asyncWrapper(suggestionsController.suggestNewEpic));
router.get("/task", verifySession(), asyncWrapper(suggestionsController.suggestNewTask));
router.get("/project", verifySession(), asyncWrapper(suggestionsController.suggestAReviewforProject));
export default router;
