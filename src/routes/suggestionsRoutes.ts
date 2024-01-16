import express from "express";
import * as suggestionsController from "../controllers/suggestionsController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware';
import asyncWrapper from "../utility/asyncWrapper";

const router = express.Router();

router.get("/projects/:projectId/suggestions/epic", verifySession(), checkUserTokens, asyncWrapper(subtractUserTokens(suggestionsController.suggestNewEpic)));
router.get("/projects/:projectId/suggestions/task", verifySession(), checkUserTokens, asyncWrapper(subtractUserTokens(suggestionsController.suggestNewTask)));
router.get("/projects/:projectId/suggestions/project", verifySession(), checkUserTokens, asyncWrapper(subtractUserTokens(suggestionsController.suggestAReviewforProject)));

export default router;