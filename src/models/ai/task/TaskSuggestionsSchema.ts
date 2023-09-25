// Represents a comprehensive project plan derived from an initial project idea summary. This includes the professional resources required, the project title, estimated duration, and the associated epics.
export interface TaskSuggestions {
    // A list of tasks that form this epic, each contributing towards its completion.
    tasks: Task[];
}

// Represents the most granular unit of work within a project. A task is a specific action or series of actions that can be delegated to a resource for execution.
export interface Task {
  // The title or designation of the task.
  title: string;

  // The projected number of days required to complete this task.
  estimateDaysToFinish: number;
}
