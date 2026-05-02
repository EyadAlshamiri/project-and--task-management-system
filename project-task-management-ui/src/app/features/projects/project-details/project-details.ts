import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { TaskModal } from '../../tasks/task-modal/task-modal';
import { TaskService } from '../../../core/services/task.service';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';
import { PriorityFormatPipe } from '../../../shared/pipes/priority-format.pipe';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzGridModule,
    NzTagModule,
    NzProgressModule,
    NzIconModule,
    NzTabsModule,
    NzEmptyModule,
    NzButtonModule,
    NzTooltipModule,
    NzAvatarModule,
    CustomButton,
    NzModalModule,
    NzPopconfirmModule,
    StatusFormatPipe,
    PriorityFormatPipe,
  ],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails implements OnInit {
  project: Project | undefined;
  isLoading = true;
  isRefreshing = false;
  currentProjectId: number | null = null;
  isViewReady = false;



  public getTaskStatusColor(status: string): string {
    switch (status) {
      case 'TODO':
        return 'default';
      case 'IN_PROGRESS':
        return 'processing';
      case 'DONE':
        return 'success';
      default:
        return 'default';
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isViewReady = true;
      this.cdr.detectChanges();
    });
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.currentProjectId = parseInt(idParam, 10);
        this.loadProject(this.currentProjectId);
      } else {
        this.isLoading = false;
      }
    });
  }

  loadProject(id: number, isRefresh = false): void {
    if (isRefresh) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
        this.isRefreshing = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching project: - project-details.ts:89', err);
        this.isLoading = false;
        this.isRefreshing = false;
        this.cdr.detectChanges();
      },
    });
  }

  refreshProject(): void {
    if (this.currentProjectId) {
      this.loadProject(this.currentProjectId, true);
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  editProject(): void {
    if (this.project) {
      this.router.navigate(['/projects/edit', this.project.id]);
    }
  }

  viewTaskDetails(taskId: number): void {
    this.router.navigate(['/tasks/details-task', taskId]);
  }

  editTask(task: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'تعديل المهمة',
      nzContent: TaskModal,
      nzWidth: 600,
      nzFooter: null,
      nzData: {
        task: task,
        members: this.project?.members || [],
      },
    });

    modalRef.afterClose.subscribe((result) => {
      if (result && this.currentProjectId) {
        const taskData = {
          ...result,
          projectId: this.currentProjectId,
        };
        this.taskService.updateTask(task.id, taskData).subscribe({
          next: () => {
            this.loadProject(this.currentProjectId!);
          },
          error: (err: any) => {
            console.error('Error updating task:', err);
          },
        });
      }
    });
  }

  addTask(): void {
    const modalRef = this.modal.create({
      nzTitle: 'إضافة مهمة جديدة',
      nzContent: TaskModal,
      nzWidth: 600,
      nzFooter: null,
      nzData: {
        projectId: this.currentProjectId,
        members: this.project?.members || [],
      },
    });

    modalRef.afterClose.subscribe((result) => {
      if (result && this.currentProjectId) {
        const taskData = {
          ...result,
          projectId: this.currentProjectId,
        };
        this.taskService.createTask(taskData).subscribe({
          next: () => {
            // Refresh the project data after adding task
            this.loadProject(this.currentProjectId!);
          },
          error: (err: any) => {
            console.error('Error creating task: - project-details.ts:142', err);
          },
        });
      }
    });
  }

  deleteTask(taskId: number): void {
    if (this.currentProjectId) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadProject(this.currentProjectId!);
        },
        error: (err: any) => {
          console.error('Error deleting task:', err);
        },
      });
    }
  }
}
