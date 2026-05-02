export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: number;
  startDate: string;
  dueDate?: string;
  assignedTo?: string;
  projectId: number;
  createdAt: string;
  selected?: boolean;
  subTasks?: SubTask[];
}

export interface SubTask {
  id: number;
  title: string;
  isCompleted: boolean;
  selected?: boolean;
  assignedTo?: string;
  taskId: number;
  createdAt: string;
}