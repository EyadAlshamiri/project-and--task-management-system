import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/projects' },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/project-list/project.routes').then((m) => m.PROJECTS_ROUTES),
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/task.routes').then((m) => m.TASKS_ROUTES),
  },
];
