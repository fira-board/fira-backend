import express from "express";
import * as suggestionsController from "../controllers/suggestionsController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware'; // Import the middleware

const router = express.Router();

router.get("/projects/:projectId/suggestions/epic", verifySession(), checkUserTokens, subtractUserTokens(suggestionsController.suggestNewEpic));
router.get("/projects/:projectId/suggestions/task", verifySession(), checkUserTokens, subtractUserTokens(suggestionsController.suggestNewTask));
router.get("/projects/:projectId/suggestions/project", verifySession(), checkUserTokens, subtractUserTokens(suggestionsController.suggestAReviewforProject));

export default router;