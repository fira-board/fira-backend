import express from "express";
import * as feedbackController from "../controllers/feedbackController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import asyncWrapper from "../utility/asyncWrapper";

const router = express.Router();

router.post("/", verifySession(), asyncWrapper(feedbackController.createFeedback));

export default router;
