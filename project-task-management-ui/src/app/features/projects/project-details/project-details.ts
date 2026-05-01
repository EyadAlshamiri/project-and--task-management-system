import { Component, OnInit } from '@angular/core';
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
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';

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
    NzPopconfirmModule,
    CustomButton
  ],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails implements OnInit {
  project: Project | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Reactive subscription to handle URL changes (e.g. from sidebar)
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = parseInt(idParam, 10);
        this.project = this.projectService.getProjectById(id);
      }
      this.isLoading = false;
    });
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

  editTask(taskId: number): void {
    // Navigate to a task edit page (using the route we added)
    this.router.navigate(['/tasks/edit-task', taskId]);
  }

  deleteTask(taskId: number): void {
    if (this.project) {
      this.projectService.deleteTask(this.project.id, taskId);
      // Refresh local project data
      this.project = this.projectService.getProjectById(this.project.id);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'blue';
      case 'ON HOLD': return 'orange';
      case 'COMPLETED': return 'green';
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

  getTaskStatusColor(status: string): string {
    switch (status) {
      case 'TODO': return 'default';
      case 'IN_PROGRESS': return 'processing';
      case 'DONE': return 'success';
      default: return 'default';
    }
  }
}
