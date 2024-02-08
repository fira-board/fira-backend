
import { TaskSuggestions } from "./TaskSuggestionsSchema";
import { IProject } from "../../../models/project";
import { Generator } from "../genrator";

const taskSuggestionsGenerator = new Generator<TaskSuggestions>("src/models/ai/task/TaskSuggestionsSchema.ts", "TaskSuggestions");
const taskDescriptionGenerator = new Generator<TaskSuggestions>("src/models/ai/task/TaskDescriptionSchema.ts", "TaskDescription");

export const generateTaskSugestions = async (projectPlan: IProject,order: number, epicName: String,model:String) => {
    const projectPlanString = JSON.stringify(projectPlan);
    let prompt:string = `this is a Json object that represnts a project plan: ${projectPlanString}  \nSuggest three new useful tasks to complete the epic goal, the epic name is (${epicName}). Keep on mind there is chronological order for the tasks in the epic. the first task is the first task in the order and the suggested task order needs to be at numeber ${order}.`;
 
    return await taskSuggestionsGenerator.call(prompt,model);
};

export const generateTaskDescription = async (taskName: string, epicName: string, otherTaskTitles: string[], userInput: string, model: string) => {
    // Format the other task titles for inclusion in the prompt
    const relatedTasksFormatted = otherTaskTitles.join(", ");
    
    let prompt = `
    Task: "${taskName}"
    Epic: "${epicName}"
    Related Tasks: [${relatedTasksFormatted}]
    Goal: "${userInput}"

    Provide a user-centric description for the task, addressing the user and their team directly. Focus on explaining the task's significance, what it entails, and how it fits into the broader objectives of the "${epicName}" epic. Avoid redundancy by not repeating the task and epic names unnecessarily. Highlight the practical applications of completing this task and how it contributes to the overall project success.
    `;
  
    return await taskDescriptionGenerator.call(prompt, model);
  };

// // Testing code :
// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// async function run(tasks: any) {
//   console.log('Waiting for 10 seconds...');
  
//   await delay(60000);

//   console.log('10 seconds have passed!');
//   console.log(tasks);
// }

// const tasks =  generateTaskSugestions('{\r\n    \"resources\": [\r\n        {\r\n            \"title\": \"Editorial Team\",\r\n            \"epics\": [\r\n                {\r\n                    \"title\": \"Content Creation\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Brainstorm Article Ideas\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Assign Articles to Writers\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Edit and Revise Articles\",\r\n                            \"estimateDaysToFinish\": 3\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 5\r\n                },\r\n                {\r\n                    \"title\": \"Layout and Design\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Design Newspaper Template\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Place Articles and Images\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Finalize Layout\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 5\r\n                },\r\n                {\r\n                    \"title\": \"Printing and Distribution\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Coordinate with Printers\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Organize Distribution Team\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Distribute Newspapers\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 3\r\n                }\r\n            ],\r\n            \"estimateDaysToFinish\": 13\r\n        },\r\n        {\r\n            \"title\": \"Marketing and Promotion\",\r\n            \"epics\": [\r\n                {\r\n                    \"title\": \"Social Media\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Create Social Media Accounts\",\r\n                            \"estimateDaysToFinish\": 1\r\n                        },\r\n                        {\r\n                            \"title\": \"Develop Content Calendar\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Post and Engage with Followers\",\r\n                            \"estimateDaysToFinish\": 5\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 8\r\n                },\r\n                {\r\n                    \"title\": \"Advertising\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Design Advertisements\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Coordinate Ad Placements\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Track Ad Performance\",\r\n                            \"estimateDaysToFinish\": 3\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 7\r\n                },\r\n                {\r\n                    \"title\": \"Events and Outreach\",\r\n                    \"tasks\": [\r\n                        {\r\n                            \"title\": \"Plan School Events\",\r\n                            \"estimateDaysToFinish\": 3\r\n                        },\r\n                        {\r\n                            \"title\": \"Coordinate with School Clubs\",\r\n                            \"estimateDaysToFinish\": 2\r\n                        },\r\n                        {\r\n                            \"title\": \"Organize Community Outreach\",\r\n                            \"estimateDaysToFinish\": 3\r\n                        }\r\n                    ],\r\n                    \"estimateDaysToFinish\": 8\r\n                }\r\n            ],\r\n            \"estimateDaysToFinish\": 23\r\n        }\r\n    ],\r\n    \"projectName\": \"School Newspaper\",\r\n    \"description\": \"A comprehensive plan for creating, promoting, and distributing a school newspaper, including content creation, layout and design, printing, marketing, and community outreach.\",\r\n    \"estimateDaysToFinish\": 36\r\n}',2,'Content Creation');
// run(tasks);