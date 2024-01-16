import express from "express";
import mongoose from "mongoose";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import epicRoutes from "./routes/epicRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import suggestionRoutes from "./routes/suggestionsRoutes";
import userRoutes from "./routes/userRoutes";

import cors from "cors";

import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { SuperTokensConfig } from "./config";
import initializeData from "./initDB";


import dotenv from "dotenv";

dotenv.config();

supertokens.init(SuperTokensConfig);

const app = express();

const PORT = process.env.PORT || 3001;


app.use(
  cors({
    origin: "http://localhost:3000",
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
initializeData();

//routes
app.use(express.json());
app.use("/projects", projectRoutes);
app.use("/resources", resourceRoutes);
app.use(userRoutes);
app.use(epicRoutes);
app.use(taskRoutes);
app.use(suggestionRoutes);
app.use("/feedback", feedbackRoutes);

// Error handling middleware, will throw 500 error if requests throw any error
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  res.json({ error: "Internal Server Error" });
});

//init server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
