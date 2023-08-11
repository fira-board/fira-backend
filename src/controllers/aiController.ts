import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { Request, Response } from 'express';


import { createLanguageModel, createJsonTranslator } from "typechat";
import { ProjectPlan } from "../models/ai/ProjectPlanSchema";



// TODO: use local .env file.
dotenv.config({ path: path.join(__dirname, "../../.env") });

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join("src/models/ai/", "ProjectPlanSchema.ts"), "utf8");
const translator = createJsonTranslator<ProjectPlan>(model, schema, "ProjectPlan");