import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { createLanguageModel, createJsonTranslator } from "typechat";
import { EpicSuggestions } from "./EpicSuggestionsSchema";
import { ProjectPlan } from "../project/ProjectPlanSchema";
import { IProject } from "../../types";

// TODO: use local .env file.
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(
  path.join("src/models/ai/epic/", "EpicSuggestionsSchema.ts"),
  "utf8"
);

const translator = createJsonTranslator<EpicSuggestions>(
  model,
  schema,
  "ProjectPlan"
);

export const generateEpicSugestions = async (projectPlan: IProject,order: number, resourceName: String) => {
  try {
    const projectPlanString = JSON.stringify(projectPlan);
    let prompt:string = `this is a Json object that represnts a project plan: ${projectPlanString}  \nSuggest three new epics for the resource ${resourceName} keep on mind there is chronological order for the epics and the tasks in each epic. the first epic is the first epic in the order and the suggested epuic order needs to be at numeber ${order}.`;
    
    const response = await translator.translate(prompt);

    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error in generateProjectPlan:", (error as any).message);
    throw error;
  }
};

//Testing code : 
// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// async function run(epics: any) {
//   console.log('Waiting for 10 seconds...');
  
//   await delay(60000);

//   console.log('10 seconds have passed!');
//   console.log(epics);
// }

// const epics =  generateEpicSugestions('{\r\n    \"resources\": [\r\n        {\r\n            \"title\": \"Editorial Team\",\r\n            \"epics\": [\r\n                {\r\n                    \"title\": \"Content Creation\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Brainstorm Article Ideas\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Assign Articles to Writers\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Edit and Revise Articles\",\r\n                            \"estimateDaysToFinish\": 3\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 5\r\n                },\r\n                {\r\n                    \"title\": \"Layout and Design\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Design Newspaper Template\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Place Articles and Images\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Finalize Layout\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 5\r\n                },\r\n                {\r\n                    \"title\": \"Printing and Distribution\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Coordinate with Printers\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Organize Distribution Team\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Distribute Newspapers\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 3\r\n                }\r\n            ],\r\n            \"estimateDaysToFinish\": 13\r\n        },\r\n        {\r\n            \"title\": \"Marketing and Promotion\",\r\n            \"epics\": [\r\n                {\r\n                    \"title\": \"Social Media\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Create Social Media Accounts\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Develop Content Calendar\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Post and Engage with Followers\",\r\n                            \"estimateDaysToFinish\": 5\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 8\r\n                },\r\n                {\r\n                    \"title\": \"Advertising\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Design Advertisements\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Coordinate Ad Placements\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Track Ad Performance\",\r\n                            \"estimateDaysToFinish\": 3\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 7\r\n                },\r\n                {\r\n                    \"title\": \"Events and Outreach\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Plan School Events\",\r\n                            \"estimateDaysToFinish\": 3\r\n                        },\r\n                        {\r\n                            \"title\": \"Coordinate with School Clubs\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Organize Community Outreach\",\r\n                            \"estimateDaysToFinish\": 3\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 8\r\n                }\r\n            ],\r\n            \"estimateDaysToFinish\": 23\r\n        }\r\n    ],\r\n    \"projectName\": \"School Newspaper\",\r\n    \"description\": \"A comprehensive plan for creating, promoting, and distributing a school newspaper, including content creation, layout and design, printing, marketing, and community outreach.\",\r\n    \"estimateDaysToFinish\": 36\r\n}','2','Editorial Team');
// run(epics);