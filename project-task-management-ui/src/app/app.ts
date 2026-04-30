import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, NzBadgeModule, NzAvatarModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isCollapsed = false;

  logo = 'assets/images/logo.png';

  projects = [
    { id: 1, name: 'تطبيق المتجر الإلكتروني' },
    { id: 2, name: 'نظام إدارة المهام' },
    { id: 3, name: 'مشروع تحليل الشبكات' }
  ]; 
  
}
