import express from "express";
import * as suggestionsController from "../controllers/suggestionsController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = express.Router();

router.get("/epic", verifySession(), suggestionsController.suggestNewEpic);
router.get("/task", verifySession(), suggestionsController.suggestNewTask);
router.get("/project", verifySession(), suggestionsController.suggestAReviewforProject);
export default router;
