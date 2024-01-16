import express from "express";
import * as userController from "../controllers/userController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import asyncWrapper from "../utility/asyncWrapper";

const router = express.Router();

router.get("/user/", verifySession(), asyncWrapper(userController.getUserDetails));
router.put("/user/", verifySession(), asyncWrapper(userController.editUserDetails));

export default router;