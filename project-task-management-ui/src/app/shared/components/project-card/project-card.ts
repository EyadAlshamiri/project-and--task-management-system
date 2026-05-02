import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  getStatusLabel(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':
      case 'نشط':
        return 'نشط';
      case 'ON HOLD':
      case 'ONHOLD':
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
      case 'ONHOLD':
      case 'موقوف':
        return 'status-hold';
      case 'COMPLETED':
      case 'مكتمل':
        return 'status-completed';
      default:
        return 'status-default';
    }
  }

  getPriorityLabel(priority: string): string {
    switch ((priority || '').toUpperCase()) {
      case 'HIGH':
      case 'عالي':
        return 'عالي';
      case 'MEDIUM':
      case 'متوسط':
        return 'متوسط';
      case 'LOW':
      case 'منخفض':
        return 'منخفض';
      default:
        return priority || 'غير محدد';
    }
  }

  getPriorityClass(priority: string): string {
    switch ((priority || '').toUpperCase()) {
      case 'HIGH':
      case 'عالي':
        return 'priority-high';
      case 'MEDIUM':
      case 'متوسط':
        return 'priority-medium';
      case 'LOW':
      case 'منخفض':
        return 'priority-low';
      default:
        return 'priority-default';
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
      case 'ONHOLD':
        return '#f59e0b';
      case 'COMPLETED':
        return '#22c55e';
      default:
        return '#0ea5e9';
    }
  }

  showModal(project: any): void {
    this.edit.emit(project.id);
  }

  get extraMembers(): number {
    const count = Array.isArray(this.project?.avatars) ? this.project.avatars.length : 0;
    return Math.max(0, count - 3);
  }

  deleteProject(id: any): void {
    this.delete.emit(id);
  }
}

