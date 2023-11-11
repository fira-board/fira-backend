import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { createLanguageModel, createJsonTranslator } from "typechat";
import { ProjectPlan } from "./ProjectPlanSchema";

// TODO: use local .env file.
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(
  path.join("src/models/ai/project/", "ProjectPlanSchema.ts"),
  "utf8"
);
const translator = createJsonTranslator<ProjectPlan>(
  model,
  schema,
  "ProjectPlan"
);

export const generateProjectPlan = async (summary: String) => {
  try {
    const prompt = summary.concat(
      " be detailed as much as possible to get the best results. each plan need to have at least six epics and three tasks for each at least for each epic."
    );
    const response = await translator.translate(prompt);

    if (!response.success) {
      console.debug(response.message);
      throw new Error(response.message);
    }
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error in generateProjectPlan:", (error as any).message);
    throw error;
  }
};
