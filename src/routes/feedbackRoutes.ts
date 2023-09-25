import express from "express";
import * as feedbackController from "../controllers/feedbackController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = express.Router();

router.post("/", verifySession(), asyncWrapper(feedbackController.createFeedback));

export default router;
