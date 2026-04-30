import { Task } from "./task";

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON HOLD',
  COMPLETED = 'COMPLETED'
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  projectManagerName?: string;

  status: ProjectStatus;
  createdAt?: Date;
  startDate?: Date;
  endDate?: Date;

  tasksCount: number;
  avatars: string[];
  progress: number;

  tasks: Task[];
}

