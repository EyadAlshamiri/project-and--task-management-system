export interface Task {
  id: number;                    // بديل TaskId
  title: string;
  status: string;

  taskExecutorName?: string;

  createdAt?: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';

  subTasks?: Task[];             
}