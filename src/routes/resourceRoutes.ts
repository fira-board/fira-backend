import express from "express";
import * as resourceController from "../controllers/resourceController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import checkPermissions from "../middleware/projectUserRoles";

const router = express.Router();

router.get("/", checkPermissions(1), verifySession(), asyncWrapper(resourceController.listResources));
router.get("/:id",checkPermissions(1), verifySession(), asyncWrapper(resourceController.getResource));
router.post("/", checkPermissions(2),verifySession(), asyncWrapper(resourceController.createResource));
router.delete("/:id",checkPermissions(2), verifySession(), asyncWrapper(resourceController.deleteResource));
router.put("/:id", checkPermissions(2),verifySession(), asyncWrapper(resourceController.updateResource));

export default router;
