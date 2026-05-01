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
      description: 'مشروع لتطوير تطبيق جوال لمتجر إلكتروني متكامل يدعم الدفع الإلكتروني وتتبع الطلبات وإدارة المنتجات بطريقة احترافية وعصرية.',
      projectManagerName: 'أحمد محمود',
      startDate: '2023-01-15T00:00:00.000Z',
      endDate: '2023-06-30T00:00:00.000Z',
      priority: 'HIGH',
      tasksCount: 4,
      status: ProjectStatus.ACTIVE,
      avatars: [
        'assets/avatars/avatar1.png',
        'assets/avatars/avatar2.png',
        'assets/avatars/avatar3.png',
        'assets/avatars/avatar4.png',
      ],
      progress: 65,
      tasks: [
        { id: 101, title: 'تصميم واجهات المستخدم (UI/UX)', status: 'DONE', priority: 'HIGH', dueDate: '2023-02-01T00:00:00.000Z', executorName: 'سارة خالد' },
        { id: 102, title: 'برمجة واجهة التطبيق (Frontend)', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2023-03-15T00:00:00.000Z', executorName: 'محمد علي' },
        { id: 103, title: 'تطوير قواعد البيانات والـ API', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '2023-04-01T00:00:00.000Z', executorName: 'أحمد محمود' },
        { id: 104, title: 'اختبار التطبيق وإصلاح الأخطاء', status: 'TODO', priority: 'LOW', dueDate: '2023-05-20T00:00:00.000Z', executorName: 'ياسر القحطاني' }
      ],
    },
    {
      id: 2,
      title: 'نظام الحجز الإلكتروني',
      description: 'بناء منصة لحجوزات الفنادق والطيران توفر أفضل العروض مع إمكانية إدارة الحجوزات وإصدار التذاكر آلياً.',
      projectManagerName: 'نورة سالم',
      startDate: '2023-03-01T00:00:00.000Z',
      endDate: '2023-09-01T00:00:00.000Z',
      priority: 'MEDIUM',
      tasksCount: 3,
      status: ProjectStatus.ON_HOLD,
      avatars: [
        'assets/avatars/avatar2.png',
        'assets/avatars/avatar4.png',
      ],
      progress: 38,
      tasks: [
        { id: 201, title: 'تحليل متطلبات النظام', status: 'DONE', priority: 'HIGH', dueDate: '2023-03-15T00:00:00.000Z', executorName: 'نورة سالم' },
        { id: 202, title: 'ربط بوابات الدفع', status: 'TODO', priority: 'HIGH', dueDate: '2023-06-01T00:00:00.000Z', executorName: 'عمر حسين' },
        { id: 203, title: 'تصميم قاعدة البيانات', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '2023-04-10T00:00:00.000Z', executorName: 'عمر حسين' }
      ],
    },
    {
      id: 3,
      title: 'لوحة التحكم الإدارية',
      description: 'تطوير لوحة تحكم لمديري النظام تتيح لهم مراقبة الأداء واستخراج التقارير وإدارة الصلاحيات للمستخدمين.',
      projectManagerName: 'سعد العتيبي',
      startDate: '2022-10-01T00:00:00.000Z',
      endDate: '2022-12-31T00:00:00.000Z',
      priority: 'LOW',
      tasksCount: 3,
      status: ProjectStatus.COMPLETED,
      avatars: [
        'assets/avatars/avatar1.png',
        'assets/avatars/avatar3.png',
      ],
      progress: 100,
      tasks: [
        { id: 301, title: 'إعداد الخوادم والاستضافة', status: 'DONE', priority: 'HIGH', dueDate: '2022-10-15T00:00:00.000Z', executorName: 'سعد العتيبي' },
        { id: 302, title: 'بناء واجهة التقارير', status: 'DONE', priority: 'MEDIUM', dueDate: '2022-11-20T00:00:00.000Z', executorName: 'فاطمة حسن' },
        { id: 303, title: 'نظام إدارة الصلاحيات', status: 'DONE', priority: 'HIGH', dueDate: '2022-12-10T00:00:00.000Z', executorName: 'سعد العتيبي' }
      ],
    },
    {
      id: 4,
      title: 'تطبيق المراقبة الذكية',
      description: 'نظام يعتمد على الذكاء الاصطناعي لمراقبة كاميرات الأمان وتحليل السلوكيات وإصدار التنبيهات في الوقت الفعلي.',
      projectManagerName: 'طارق الدوسري',
      startDate: '2023-05-10T00:00:00.000Z',
      endDate: '2023-11-30T00:00:00.000Z',
      priority: 'HIGH',
      tasksCount: 0,
      status: ProjectStatus.ACTIVE,
      avatars: [
        'assets/avatars/avatar1.png',
        'assets/avatars/avatar2.png',
        'assets/avatars/avatar3.png',
      ],
      progress: 15,
      tasks: [], // Leaving this one empty for testing the empty state UX
    }
  ];

  getProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: number): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  addProject(project: Omit<Project, 'id'>): Project {
    const newProject: Project = {
      ...project,
      id: Date.now(),
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(updatedProject: Project): void {
    const index = this.projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      this.projects[index] = updatedProject;
    }
  }

  deleteProject(id: number): void {
    this.projects = this.projects.filter(p => p.id !== id);
  }

  getTaskById(taskId: number): any {
    for (const project of this.projects) {
      const task = project.tasks?.find(t => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  }

  deleteTask(projectId: number, taskId: number): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project && project.tasks) {
      project.tasks = project.tasks.filter(t => t.id !== taskId);
    }
  }
}
