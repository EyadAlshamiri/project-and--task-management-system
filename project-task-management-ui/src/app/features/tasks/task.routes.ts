import { Routes } from '@angular/router';
import { TaskList } from './task-list/task-list';
import { TaskForm } from './task-form/task-form';
import { TaskDetails } from './task-details/task-details';
import { TaskEditPage } from './task-edit-page/task-edit-page';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TaskList,
  },
  {
    path: 'add-task',
    component: TaskForm,
  },
  {
    path: 'details-task/:id',
    component: TaskDetails,
  },
  {
    path: 'edit-task/:id',
    component: TaskEditPage,
  },
];