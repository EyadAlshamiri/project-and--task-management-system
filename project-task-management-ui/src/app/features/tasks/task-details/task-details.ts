import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NzTagModule, 
    NzIconModule, 
    NzButtonModule, 
    NzAvatarModule,
    NzEmptyModule,
    NzSpinModule,
    CustomButton
  ],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  task: Task | undefined;
  isLoading = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = parseInt(idParam, 10);
        this.isLoading = true;
        this.taskService.getTaskById(id).subscribe({
          next: (task) => {
            console.log('✅ Task Loaded:', task);
            this.task = task;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('❌ Error loading task:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks/edit-task', this.task.id]);
    }
  }

  public getStatusLabel(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'TODO' || s === 'قيد الانتظار') return 'قيد الانتظار';
    if (s === 'IN_PROGRESS' || s === 'قيد التنفيذ') return 'قيد التنفيذ';
    if (s === 'DONE' || s === 'مكتمل') return 'مكتمل';
    return status || 'غير محدد';
  }

  public getPriorityLabel(priority: any): string {
    const p = (priority?.toString() || '').toUpperCase();
    if (p === 'HIGH' || p === '2' || p === 'عالي') return 'عالي';
    if (p === 'MEDIUM' || p === '1' || p === 'متوسط') return 'متوسط';
    if (p === 'LOW' || p === '0' || p === 'منخفض') return 'منخفض';
    return 'غير محدد';
  }

  public getStatusColor(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'TODO' || s === 'قيد الانتظار') return 'default';
    if (s === 'IN_PROGRESS' || s === 'قيد التنفيذ') return 'processing';
    if (s === 'DONE' || s === 'مكتمل') return 'success';
    return 'default';
  }

  public getPriorityColor(priority: any): string {
    const p = (priority?.toString() || '').toUpperCase();
    if (p === 'HIGH' || p === '2' || p === 'عالي') return 'red';
    if (p === 'MEDIUM' || p === '1' || p === 'متوسط') return 'orange';
    if (p === 'LOW' || p === '0' || p === 'منخفض') return 'green';
    return 'default';
  }
}
