import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ProjectCard } from '../../../shared/components/project-card/project-card';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { AddButton } from '../../../shared/components/add-button/add-button';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectStatus } from '../../../core/models/project';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule, 
    FormsModule, 
    NzInputModule, 
    NzButtonModule, 
    NzIconModule, 
    NzEmptyModule, 
    NzSkeletonModule, 
    ProjectCard, 
    SearchBar, 
    AddButton,
    StatusFormatPipe
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  providers: [NzModalService]
})
export class ProjectList implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  filterStatus: ProjectStatus | 'ALL' = 'ALL';
  currentSearchText: string = '';
  isLoading = true;


  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private messageService: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data || [];
        this.applyFiltersAndSort();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(searchText: string): void {
    this.currentSearchText = searchText;
    this.applyFiltersAndSort();
  }

  onAddClick(): void {
    this.router.navigate(['/projects/add-project']);
  }

  goToProjectDetails(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  onEditProject(projectId: number): void {
    this.router.navigate(['/projects/edit', projectId]);
  }

  onDeleteProject(project: any): void {
    const projectId = typeof project === 'number' ? project : project.id;
    const tasksCount = typeof project === 'object' ? project.tasksCount : 0;

    if (tasksCount > 0) {
      this.modalService.confirm({
        nzTitle: 'تحذير حذف المشروع',
        nzContent: `هذا المشروع يحتوي على ${tasksCount} مهام. حذف المشروع سيؤدي لحذف كافة المهام المرتبطة نهائياً. هل تريد الاستمرار؟`,
        nzOkText: 'نعم، احذف الكل',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => this.executeDelete(projectId),
        nzCancelText: 'إلغاء'
      });
    } else {
      this.executeDelete(projectId);
    }
  }

  private executeDelete(projectId: number): void {
    this.projectService.deleteProject(projectId).subscribe(() => {
      this.messageService.success('تم حذف المشروع بنجاح');
      this.loadProjects();
    });
  }

  onFilterClick(): void {
    const statuses: (ProjectStatus | 'ALL')[] = ['ALL', ProjectStatus.ACTIVE, ProjectStatus.ON_HOLD, ProjectStatus.COMPLETED];
    const currentIndex = statuses.indexOf(this.filterStatus);
    this.filterStatus = statuses[(currentIndex + 1) % statuses.length];
    this.applyFiltersAndSort();
  }

  onSortClick(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFiltersAndSort();
  }



  private applyFiltersAndSort(): void {
    let filtered = [...this.projects];

    // تطبيق البحث
    if (this.currentSearchText && this.currentSearchText.trim()) {
      const value = this.currentSearchText.trim().toLowerCase();
      filtered = filtered.filter((project) => (project.tilte || '').toLowerCase().includes(value));
    }

    // تطبيق التصفية حسب الحالة
    if (this.filterStatus !== 'ALL') {
      filtered = filtered.filter((project) => project.status === this.filterStatus);
    }

    // تطبيق الترتيب
    filtered.sort((a, b) => {
      const titleA = (a.tilte || '').toLowerCase();
      const titleB = (b.tilte || '').toLowerCase();
      if (this.sortOrder === 'asc') {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

    this.filteredProjects = filtered;
  }
}


