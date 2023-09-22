import express from "express";
import mongoose from "mongoose";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import epicRoutes from "./routes/epicRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI);

app.use(express.json());
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/epics", epicRoutes);
app.use("/resources", resourceRoutes);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

function errorHandler(err: any, req: express.Request, res: express.Response) {
  console.error(req.url);
  console.error(err.stack);
  res.status(500).send("Something broke!");
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
