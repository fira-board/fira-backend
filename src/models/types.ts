import { Document, Types } from 'mongoose';

// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;

export interface ITask extends Document {
  title: string;
  userId: string;
  status: "Not Started" | "In Progress" | "Completed";
  estimateDaysToFinish?: number;
  deleted: boolean;
  epic: Ref<IEpic>;
  resource: Ref<IResource>;
  project: Ref<IProject>;
}

export interface IEpic extends Document {
  title: string;
  userId: string;
  status: "Not Started" | "In Progress" | "Completed";
  deleted: boolean;
  tasks: Ref<ITask>[];
  resource: Ref<IResource>;
  project: Ref<IProject>;
}

export interface IResource extends Document {
  title: string;
  userId: string;
  epics: Ref<IEpic>[];
  tasks: Ref<ITask>[];
  project: Ref<IProject>;
}

export interface IProject extends Document {
  projectName?: string;
  userId?: string;
  description?: string;
  prompt?: string;
  resources?: Ref<IResource>[];
  epics?: Ref<IEpic>[];
  tasks?: Ref<ITask>[];
}
