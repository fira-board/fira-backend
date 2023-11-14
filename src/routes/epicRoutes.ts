import express from "express";
import * as epicController from "../controllers/epicController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import  checkPermissions  from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/", verifySession(), checkPermissions(1),asyncWrapper(epicController.listEpics));
router.get("/:id", verifySession(),checkPermissions(1), asyncWrapper(epicController.listEpic));
router.post("/", verifySession(),checkPermissions(2), asyncWrapper(epicController.createEpic));
router.delete("/:id", verifySession(),checkPermissions(2), asyncWrapper(epicController.deleteEpic));
router.put("/:id", verifySession(),checkPermissions(2), asyncWrapper(epicController.updateEpic));

export default router;
