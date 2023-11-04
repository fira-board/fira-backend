import express from "express";
import * as projectController from "../controllers/projectController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { checkUserTokens, subtractUserTokens } from '../middleware/tokensMiddleware'; // Import the middleware



const router = express.Router();

router.get("/", verifySession(), asyncWrapper(projectController.listProjects));
router.get("/:id", verifySession(), asyncWrapper(projectController.getProject));
router.post("/", verifySession(), checkUserTokens, subtractUserTokens, asyncWrapper(projectController.createProject));
router.delete("/:id", verifySession(), asyncWrapper(projectController.deleteProject));
router.put("/:id", verifySession(), asyncWrapper(projectController.updateProject));

export default router;
