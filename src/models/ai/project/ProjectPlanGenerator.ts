import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { createLanguageModel, createJsonTranslator } from "fira-board-typechat";
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
  const prompt = summary.concat(
    " be detailed as much as possible to get the best results. each plan need to have at least six epics and three tasks for each at least for each epic."
  );
  const response = await translator.translate(prompt);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
};


// // // Testing code :
// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// async function run(tasks: any) {
//   console.log('Waiting for 10 seconds...');

//   await delay(60000);

//   console.log('10 seconds have passed!');
//   console.log(tasks);
// }

// const tasks = generateProjectPlan('I want to start a company in Dubai.');
// run(tasks);

// console.log('This will run before the 10 seconds delay!');