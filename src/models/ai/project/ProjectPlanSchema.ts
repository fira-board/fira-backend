// Represents a comprehensive project plan derived from an initial project idea summary. This includes the professional resources required, the project title, estimated duration, and the associated epics.
export interface ProjectPlan {
  // A list of professional resources needed to execute the project.
  resources: Resource[];

  // Reflects the title of the project as derived from the project summary. If the summary lacks a title, a unique and catchy project name should be generated.
  projectName: string;

  // A succinct rationale detailing the choice of this specific project plan.
  description: string;

  // The projected number of days required to complete the entire project.
  estimateDaysToFinish: number;
}

// Denotes a specific role within the project, identifying the individual or team with the expertise to execute particular tasks and epics, contributing towards the project's completion.
export interface Resource {
  // The title or designation of the resource.
  title: string;

  // A list of epics associated with this resource, indicating the larger objectives they aim to achieve within the project.
  epics: Epic[];

  // The projected number of days this resource will need to complete their associated epics.
  estimateDaysToFinish: number;
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