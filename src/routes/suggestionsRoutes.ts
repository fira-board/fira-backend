import express from "express";
import * as suggestionsController from "../controllers/suggestionsController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware'; // Import the middleware

const router = express.Router();

router.get("/epic", verifySession(), checkUserTokens, subtractUserTokens(suggestionsController.suggestNewEpic));
router.get("/task", verifySession(), checkUserTokens, subtractUserTokens(suggestionsController.suggestNewTask));
router.get("/project", verifySession(), checkUserTokens, subtractUserTokens(suggestionsController.suggestAReviewforProject));

export default router;