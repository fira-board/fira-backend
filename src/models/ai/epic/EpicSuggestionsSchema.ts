// Represents a comprehensive project plan derived from an initial project idea summary. This includes the professional resources required, the project title, estimated duration, and the associated epics.
export interface EpicSuggestions {
  // A list of Epics needed to execute the project.
  suggestions: Epic[];

}

// An epic represents a larger objective within the project, encompassing a series of related tasks that work together towards achieving a common goal.
export interface Epic {
  // The title or designation of the epic.
  title: string;

  // A list of tasks that form this epic, each contributing towards its completion.
  tasks: Task[];

  // The projected number of days required to complete all tasks within this epic.
  estimateDaysToFinish: number;
}

// Represents the most granular unit of work within a project. A task is a specific action or series of actions that can be delegated to a resource for execution.
export interface Task {
  // The title or designation of the task.
  title: string;

  // The projected number of days required to complete this task.
  estimateDaysToFinish: number;
}
