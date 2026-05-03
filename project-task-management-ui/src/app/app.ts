import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ProjectService } from './core/services/project.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, NzBadgeModule, NzAvatarModule, NzDrawerModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  isCollapsed = false;
  isDrawerVisible = false;
  isMobile = false;
  isFullPage = false;
  logo = 'assets/images/logo.png';
  userAvatar = 'assets/avatars/avatar1.png'
  projects: any[] = [];
  
  private breakpointObserver = inject(BreakpointObserver);

  constructor(private projectService: ProjectService, private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkUrl(event.urlAfterRedirects);
      this.isDrawerVisible = false;
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      setTimeout(() => {
        this.isMobile = result.matches;
        this.isCollapsed = result.matches;
        this.cdr.detectChanges();
      });
    });

    this.projectService.getProjects().subscribe({
      next: (res) => {
        this.projects = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading projects:', err)
    });
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.isDrawerVisible = !this.isDrawerVisible;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
  }

  private checkUrl(url: string): void {
    // Hide layout for Project Details, Add Project, Edit Project, Task Details, and Task Edit
    this.isFullPage = /^\/(projects\/(add-project|edit\/\d+|\d+)|tasks\/(details-task|edit-task)\/\d+)$/.test(url);
  }
}

