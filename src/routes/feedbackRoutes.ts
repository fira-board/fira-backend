import promiseRouter from 'express-promise-router';
import * as feedbackController from "../controllers/feedbackController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = promiseRouter();

router.post("/", verifySession(), feedbackController.createFeedback);

export default router;