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
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { middleware, errorHandler, SessionRequest } from "supertokens-node/framework/express";
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
app.use("/tasks", taskRoutes);
app.use("/epics", epicRoutes);
app.use("/resources", resourceRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/suggestions", suggestionRoutes);

//session info
app.get("/sessioninfo", verifySession(), async (req: SessionRequest, res) => {
  let session = req.session;
  res.send({
    sessionHandle: session!.getHandle(),
    userId: session!.getUserId(),
    accessTokenPayload: session!.getAccessTokenPayload(),
  });
});

//Error handling
app.use(errorHandler());

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});


//init server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
