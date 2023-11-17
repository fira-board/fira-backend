import express from "express";
import mongoose from "mongoose";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import epicRoutes from "./routes/epicRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import suggestionRoutes from "./routes/suggestionsRoutes";

import cors from "cors";

import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { getWebsiteDomain, SuperTokensConfig } from "./config";


import dotenv from "dotenv";

dotenv.config();

supertokens.init(SuperTokensConfig);

const app = express();

const PORT = process.env.PORT || 3001;


app.use(
  cors({
    origin: getWebsiteDomain(),
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


//routes
app.use(express.json());
app.use("/projects", projectRoutes);
app.use("/projects/:projectId/resources", resourceRoutes);
app.use("/projects/:projectId/epics", epicRoutes);
app.use("/projects/:projectId/tasks", taskRoutes);
app.use("/projects/:projectId/suggestions", suggestionRoutes);
app.use("/feedback", feedbackRoutes);


//init server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
