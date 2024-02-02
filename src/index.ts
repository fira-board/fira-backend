import express from "express";
import promiseRouter from 'express-promise-router';
import mongoose from "mongoose";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import activityRoutes from "./routes/activityRoutes";
import epicRoutes from "./routes/epicRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import suggestionRoutes from "./routes/suggestionsRoutes";
import userRoutes from "./routes/userRoutes";

import cors from "cors";

import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { SuperTokensConfig } from "./config";
// import initializeData from "./initDB";


import dotenv from "dotenv";

dotenv.config();

supertokens.init(SuperTokensConfig);

const app = express();
const router = promiseRouter();

const PORT = process.env.PORT || 3001;


app.use(
  cors({
    origin: ["https://firaboard.ai"],
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

// This exposes all the APIs from SuperTokens to the client.
app.use(middleware());


//MongoDB config
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI);
// initializeData();

//routes
app.use(express.json());

// Mount your promiseRouter instance on the app
app.use(router);

router.use("/projects", projectRoutes);
router.use("/resources", resourceRoutes);
router.use(userRoutes);
router.use(epicRoutes);
router.use(taskRoutes);
router.use(activityRoutes);
router.use(suggestionRoutes);
router.use("/feedback", feedbackRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500);
  res.json({ error: "Internal Server Error" });
});

//init server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
