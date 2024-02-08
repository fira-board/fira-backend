// TaskContext provides additional information about the task's environment and objectives.
export interface TaskContext {
  // The name of the task.
  taskName: string;

  // The name of the epic the task belongs to, providing a broader project context.
  epicName: string;

  // Titles of other related tasks within the same epic, offering insight into related work.
  relatedTaskTitles: string[];

  // User input or goal that specifies what the task is intended to achieve.
  userInput: string;
}

// Represents a detailed and summarized description of a task, generated based on the provided context.
export interface TaskDescription extends TaskContext {
  // The generated description of the task, combining details and summary.
  description: string;
}
