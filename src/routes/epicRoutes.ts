import express from "express";
import * as epicController from "../controllers/epicController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import  checkPermissions  from "../middleware/projectUserRoles";
import trackActivity from "../middleware/activityMiddleware"
import { ITEM_CREATE, ITEM_EDIT, ITEM_DELETE } from "../models/activity"

const router = express.Router();

router.get("/projects/:projectId/epics/", verifySession(), checkPermissions(1),epicController.listEpics);
router.get("/projects/:projectId/epics/:id", verifySession(),checkPermissions(1), epicController.getEpic);
router.post("/projects/:projectId/epics/", verifySession(),checkPermissions(2), trackActivity(ITEM_CREATE, "epic"), epicController.createEpic);
router.delete("/projects/:projectId/epics/:id", verifySession(),checkPermissions(2), trackActivity(ITEM_DELETE, "epic"), epicController.deleteEpic);
router.put("/projects/:projectId/epics/:id", verifySession(),checkPermissions(2), trackActivity(ITEM_EDIT, "epic"), epicController.updateEpic);

export default router;
