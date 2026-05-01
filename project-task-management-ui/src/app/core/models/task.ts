export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;

  executorName?: string;

  createdAt?: Date | string;
  dueDate?: Date | string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | string;

  subTasks?: Task[];             
}