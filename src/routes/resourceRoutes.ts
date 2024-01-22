import express from "express";
import * as resourceController from "../controllers/resourceController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = express.Router();

router.get("/", verifySession(), resourceController.listResources);
router.get("/:id", verifySession(), resourceController.getResource);
router.post("/", verifySession(), resourceController.createResource);

export default router;
