import { Component, OnInit, inject } from '@angular/core';
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
            this.task = task;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading task:', err);
            this.isLoading = false;
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'TODO': return 'default';
      case 'IN_PROGRESS': return 'processing';
      case 'DONE': return 'success';
      default: return 'default';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'green';
      default: return 'default';
    }
  }
}
