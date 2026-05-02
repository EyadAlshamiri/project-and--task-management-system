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
  currentSearchText: string = '';
  isLoading = true;


  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    setTimeout(() => {
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

  onDeleteProject(projectId: number): void {
    this.projectService.deleteProject(projectId).subscribe(() => {
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


