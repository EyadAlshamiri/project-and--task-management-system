import { Component, OnInit } from '@angular/core';
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
    AddButton
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  filterStatus: ProjectStatus | 'ALL' = 'ALL';
  isLoading = true;


  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.isLoading = true;
    try {
      const data = this.projectService.getProjects();
      this.projects = data || [];
      this.applyFiltersAndSort();
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearchChange(searchText: string): void {
    this.applyFiltersAndSort(searchText);
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

  onDeleteProject(projectId: number): void {
    this.projectService.deleteProject(projectId);
    this.loadProjects();
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

  getFilterStatusText(): string {
    switch (this.filterStatus) {
      case 'ALL':
        return 'الكل';
      case ProjectStatus.ACTIVE:
        return 'نشط';
      case ProjectStatus.ON_HOLD:
        return 'معلق';
      case ProjectStatus.COMPLETED:
        return 'مكتمل';
      default:
        return 'الكل';
    }
  }

  private applyFiltersAndSort(searchText: string = ''): void {
    let filtered = [...this.projects];

    // تطبيق البحث
    if (searchText && searchText.trim()) {
      const value = searchText.trim().toLowerCase();
      filtered = filtered.filter((project) => (project.title || '').toLowerCase().includes(value));
    }

    // تطبيق التصفية حسب الحالة
    if (this.filterStatus !== 'ALL') {
      filtered = filtered.filter((project) => project.status === this.filterStatus);
    }

    // تطبيق الترتيب
    filtered.sort((a, b) => {
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      if (this.sortOrder === 'asc') {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

    this.filteredProjects = filtered;
  }
}


