import { Task } from "./task";

export enum ProjectStatus {
  ACTIVE = 'Active',
  ON_HOLD = 'OnHold',
  COMPLETED = 'Completed'
}

export interface Project {
  id: number;
  tilte: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  projectManagerName?: string;
  progress: number;
  members?: string[];
  createdAt: string;
  tasksCount: number;
  tasks?: Task[];
}
