import { Types } from 'mongoose';

// The type Ref<T> is either an ObjectId or the full type T
type Ref<T> = T | Types.ObjectId;

export interface ITask {
    title: string;
    resource: Ref<IResource>;
    epic: Ref<IEpic>;
    status: 'Not Started' | 'In Progress' | 'Completed';
    estimateDaysToFinish?: number;
}

export interface IEpic {
    title: string;
    resource: Ref<IResource>;
    tasks: Ref<ITask>[];
    status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface IResource {
    title: string;
    epics: Ref<IEpic>[];
    tasks: Ref<ITask>[];
    project: string;
}

export interface IProject {
    name?: string;
    description?: string;
    prompt?: string;
    resources?: Ref<IResource>[];
    userId: string;
}
