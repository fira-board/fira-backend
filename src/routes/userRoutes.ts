import express from "express";
import * as userController from "../controllers/userController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = express.Router();

router.get("/user/", verifySession(), userController.getUserDetails);
router.post("/user/edit/", verifySession(), userController.editUserDetails);

export default router;