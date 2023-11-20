import express from "express";
import * as epicController from "../controllers/epicController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import  checkPermissions  from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/", verifySession(), checkPermissions(1),epicController.listEpics);
router.get("/:id", verifySession(),checkPermissions(1), epicController.listEpic);
router.post("/", verifySession(),checkPermissions(2), epicController.createEpic);
router.delete("/:id", verifySession(),checkPermissions(2), epicController.deleteEpic);
router.put("/:id", verifySession(),checkPermissions(2), epicController.updateEpic);

export default router;
