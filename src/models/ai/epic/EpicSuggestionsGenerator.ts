import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { createLanguageModel, createJsonTranslator } from "typechat";
import { EpicSuggestions } from "./EpicSuggestionsSchema";

// TODO: use local .env file.
dotenv.config({ path: path.join(__dirname, "../../.env") });

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(
  path.join("src/models/ai/", "ProjectPlanSchema.ts"),
  "utf8"
);
const translator = createJsonTranslator<EpicSuggestions>(
  model,
  schema,
  "ProjectPlan"
);

export const generateEpicSugestions = async (projectPlan: String, resourceName: String) => {
  try {
    const prompt = 'this is a Json object that represnts a project plan: {projectplan}  \nSuggest three new epics for the resource {resourceName}';
    
    const response = await translator.translate(prompt);

    if (!response.success) {
      console.debug(response.message);
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error in generateProjectPlan:", (error as any).message);
    throw error;
  }
};
