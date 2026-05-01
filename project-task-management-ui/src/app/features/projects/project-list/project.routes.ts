import { Routes } from '@angular/router';
import { ProjectList } from './project-list';    
import { ProjectForm } from '../project-form/project-form';
import { ProjectDetails } from '../project-details/project-details';

export const PROJECTS_ROUTES: Routes = [
  { 
    path: '', 
    component: ProjectList ,
  },

  {
    path: 'add-project',
    component: ProjectForm , 
  } ,
  {
    path: 'edit/:id',
    component: ProjectForm ,
  },

  {
    path: ':id',
    component: ProjectDetails ,
  }
  
];