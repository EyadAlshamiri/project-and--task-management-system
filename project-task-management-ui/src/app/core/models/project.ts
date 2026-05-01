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
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  createdAt?: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;

  tasksCount: number;
  avatars: string[];
  progress: number;
  members?: number[];

  tasks: Task[];
}

