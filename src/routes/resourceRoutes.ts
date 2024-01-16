import express from "express";
import * as resourceController from "../controllers/resourceController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import asyncWrapper from "../utility/asyncWrapper";

const router = express.Router();

router.get("/", verifySession(), asyncWrapper(resourceController.listResources));
router.get("/:id", verifySession(), asyncWrapper(resourceController.getResource));
router.post("/", verifySession(), asyncWrapper(resourceController.createResource));

export default router;
