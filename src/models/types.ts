// src/models/types.ts

export interface ITask {
    title: string;
    description?: string;
    resource?: string;
    epic?: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    estimateDaysToFinish?: number;
}

export interface IProject {
    name?: string;
    description?: string;
    resources?: string[];
    epics?: string[];
    tasks?: ITask[];
    userId: string;
    contributors?: string[];
}
