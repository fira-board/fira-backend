import { Generator } from "../genrator";
import { ProjectPlan } from "./ProjectPlanSchema";

const projectPlanGenerator = new Generator<ProjectPlan>("src/models/ai/project/ProjectPlanSchema.ts", "ProjectPlan");

export const generateProjectPlan = async (summary: String, model: String) => {

  const prompt = summary.concat(
    " be detailed as much as possible to get the best results. each plan need to have at least two resources , six epics and three tasks for each epic. some of the tasks may have a positive environmental or social impact."
  );
  
  return projectPlanGenerator.call(prompt, model);
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

// const tasks = generateProjectPlan('I want to start a company in Dubai.',"GPT-4");
// run(tasks);

// console.log('This will run before the 10 seconds delay!');