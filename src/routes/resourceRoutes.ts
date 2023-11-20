import express from "express";
import * as resourceController from "../controllers/resourceController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import checkPermissions from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/", checkPermissions(1), verifySession(), resourceController.listResources);
router.get("/:id",checkPermissions(1), verifySession(), resourceController.getResource);
router.post("/", checkPermissions(2),verifySession(), resourceController.createResource);
router.delete("/:id",checkPermissions(2), verifySession(), resourceController.deleteResource);
router.put("/:id", checkPermissions(2),verifySession(), resourceController.updateResource);

export default router;
