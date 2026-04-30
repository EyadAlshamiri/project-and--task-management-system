import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-project-card',
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzDropDownModule,
    NzMenuModule,
    NzAvatarModule,
    NzProgressModule,
    NzTooltipModule,
    NzPopconfirmModule,
    NzIconModule,
    NzSkeletonModule,
  ],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  @Input() loading: boolean = false;
  @Input() project: any = {
    id: 0,
    title: '',
    tasksCount: 0,
    status: 'ACTIVE',
    avatars: [],
    progress: 0,
  };

  getStatusLabel(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':
      case 'نشط':
        return 'نشط';
      case 'ON HOLD':
      case 'موقوف':
        return 'موقوف';
      case 'COMPLETED':
      case 'مكتمل':
        return 'مكتمل';
      default:
        return status || 'غير معروف';
    }
  }

  getStatusClass(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':
      case 'نشط':
        return 'status-active';
      case 'ON HOLD':
      case 'موقوف':
        return 'status-hold';
      case 'COMPLETED':
      case 'مكتمل':
        return 'status-completed';
      default:
        return 'status-default';
    }
  }

  getProgress(project: any): number {
    return project?.progress ?? 0;
  }

  getProgressColor(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':
        return '#22c55e';
      case 'ON HOLD':
        return '#f59e0b';
      case 'COMPLETED':
        return '#22c55e';
      default:
        return '#0ea5e9';
    }
  }

  showModal(project: any): void {
    console.log('Edit project', project);
  }

  get extraMembers(): number {
    const count = Array.isArray(this.project?.avatars) ? this.project.avatars.length : 0;
    return Math.max(0, count - 3);
  }

  deleteProject(id: any): void {
    console.log('Delete project', id);
  }
}

