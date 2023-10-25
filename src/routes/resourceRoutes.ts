import express from "express";
import * as resourceController from "../controllers/resourceController";
import { asyncWrapper } from "../asyncWrapper";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = express.Router();

router.get("/", verifySession(), asyncWrapper(resourceController.listResources));
router.get("/:id", verifySession(), asyncWrapper(resourceController.getResource));
router.post("/", verifySession(), asyncWrapper(resourceController.createResource));
router.delete("/:id", verifySession(), asyncWrapper(resourceController.deleteResource));
router.put("/:id", verifySession(), asyncWrapper(resourceController.updateResource));

export default router;
