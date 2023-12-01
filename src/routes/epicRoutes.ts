import express from "express";
import * as epicController from "../controllers/epicController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import  checkPermissions  from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/projects/:projectId/epics/", verifySession(), checkPermissions(1),epicController.listEpics);
router.get("/projects/:projectId/epics/:id", verifySession(),checkPermissions(1), epicController.getEpic);
router.post("/projects/:projectId/epics/", verifySession(),checkPermissions(2), epicController.createEpic);
router.delete("/projects/:projectId/epics/:id", verifySession(),checkPermissions(2), epicController.deleteEpic);
router.put("/projects/:projectId/epics/:id", verifySession(),checkPermissions(2), epicController.updateEpic);

export default router;
