import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { ProjectService } from './core/services/project.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, NzBadgeModule, NzAvatarModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  isCollapsed = false;
  isFullPage = false;
  logo = 'assets/images/logo.png';
  userAvatar = 'assets/avatars/avatar1.png'
  projects: any[] = [];

  constructor(private projectService: ProjectService, private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkUrl(event.urlAfterRedirects);
    });
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (res) => {
        this.projects = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading projects:', err)
    });
  }

  private checkUrl(url: string): void {
    // Hide layout for Project Details, Add Project, Edit Project, Task Details, and Task Edit
    this.isFullPage = /^\/(projects\/(add-project|edit\/\d+|\d+)|tasks\/(details-task|edit-task)\/\d+)$/.test(url);
  }
}

