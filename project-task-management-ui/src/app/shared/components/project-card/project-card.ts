import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
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
import { StatusFormatPipe } from '../../pipes/status-format.pipe';
import { PriorityFormatPipe } from '../../pipes/priority-format.pipe';

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
    StatusFormatPipe,
    PriorityFormatPipe
  ],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
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



  getProgress(project: any): number {
    return project?.progress ?? 0;
  }

  getProgressColor(percent: number): string {
    if (percent >= 100) return '#22c55e'; // Green
    if (percent >= 70) return '#10b981'; // Emerald
    if (percent >= 40) return '#f59e0b'; // Amber/Orange
    if (percent >= 20) return '#f97316'; // Orange/Red
    return '#ef4444'; // Red
  }

  showModal(project: any): void {
    this.edit.emit(project.id);
  }

  getMemberAvatars(): any[] {
    const members = this.project?.members || [];
    const avatars = this.project?.avatars || [];
    
    // If we have explicit avatar images, use them
    if (avatars.length > 0) return avatars;

    // Otherwise, generate from member names
    return members.map((name: string) => ({
      name: name,
      initial: name.trim().charAt(0).toUpperCase(),
      color: this.getAvatarColor(name)
    }));
  }

  getAvatarColor(name: string): string {
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a', '#eb2f96'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  get extraMembers(): number {
    const members = this.project?.members || [];
    const avatars = this.project?.avatars || [];
    const count = Math.max(members.length, avatars.length);
    return Math.max(0, count - 3);
  }

  deleteProject(id: any): void {
    this.delete.emit(id);
  }
}

