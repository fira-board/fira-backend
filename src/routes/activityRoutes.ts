import express from "express";
import * as activityController from "../controllers/activityController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import checkPermissions from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/projects/:projectId/activity/", verifySession(), checkPermissions(1), activityController.listActivity);

export default router;