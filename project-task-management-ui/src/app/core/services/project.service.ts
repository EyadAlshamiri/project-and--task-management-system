import { Injectable } from '@angular/core';
import { Project, ProjectStatus } from '../models/project';


@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: 1,
      title: 'تطبيق المتجر الإلكتروني',
      tasksCount: 15,
      status: ProjectStatus.ACTIVE,
      avatars: [
        'assets/avatars/avatar1.png',
        'assets/avatars/avatar2.png',
        'assets/avatars/avatar3.png',
        'assets/avatars/avatar4.png',
        'assets/avatars/avatar4.png',
      ],
      progress: 65,
      tasks: [],
    },
    {
      id: 2,
      title: 'نظام الحجز الإلكتروني',
      tasksCount: 8,
      status: ProjectStatus.ON_HOLD,
      avatars: [
        'assets/avatars/avatar2.png',
        'assets/avatars/avatar4.png',
      ],
      progress: 38,
      tasks: [],
    },
    {
      id: 3,
      title: 'لوحة التحكم الإدارية',
      tasksCount: 12,
      status: ProjectStatus.COMPLETED,
      avatars: [
        'assets/avatars/avatar1.png',
        'assets/avatars/avatar3.png',
      ],
      progress: 100,
      tasks: [],
    },
    {
      id: 4,
      title: 'تطبيق المراقبة الذكية',
      tasksCount: 9,
      status: ProjectStatus.ACTIVE,
      avatars: [
        'assets/avatars/avatar1.png',
        'assets/avatars/avatar2.png',
        'assets/avatars/avatar3.png',
      ],
      progress: 55,
      tasks: [],
    },
    {
      id: 5,
      title: 'محفظة الدفع الرقمية',
      tasksCount: 20,
      status: ProjectStatus.ON_HOLD,
      avatars: [
        'assets/avatars/avatar1.png',
        'assets/avatars/avatar4.png',
      ],
      progress: 42,
      tasks: [],
    },
  ];

  getProjects(): Project[] {
    return this.projects;
  }

}
