import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TaskModal } from '../task-modal/task-modal';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzRadioModule,
    NzTagModule,
    NzCheckboxModule,
    FormsModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  filterStatus = 'All';
  tasks: any[] = [
    { id: 1, name: 'Setup CI/CD Pipeline', status: 'TODO', selected: false },
    { id: 2, name: 'Implement User Auth', status: 'IN_PROGRESS', selected: false },
    { id: 3, name: 'Design Dashboard Layout', status: 'IN_PROGRESS', selected: false },
    { id: 4, name: 'Design Dashboard Monikoting', status: 'DONE', selected: false },
    { id: 5, name: 'Setup CI/CD Pipeline', status: 'TODO', selected: false },
    { id: 6, name: 'Implement User Auth', status: 'IN_PROGRESS', selected: false },
    { id: 7, name: 'Completerd App linput', status: 'DONE', selected: false },
  ];

  filteredTasks = [...this.tasks];

  constructor(
    private modalService: NzModalService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const sharedTasks = this.taskService.getTasks();
    if (sharedTasks && sharedTasks.length > 0) {
      this.tasks = sharedTasks;
    }
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filterStatus === 'All') {
      this.filteredTasks = [...this.tasks];
    } else {
      const statusMap: any = {
        'Todo': 'TODO',
        'In Progress': 'IN_PROGRESS',
        'Done': 'DONE'
      };
      const targetStatus = statusMap[this.filterStatus];
      this.filteredTasks = this.tasks.filter(t => t.status === targetStatus);
    }
  }

  addTask(): void {
    const modal = this.modalService.create({
      nzTitle: 'إضافة مهمة جديدة',
      nzContent: TaskModal,
      nzFooter: null,
      nzWidth: 500
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.tasks.push({
          id: Date.now(),
          name: result.title,
          status: result.status,
          selected: false
        });
        this.applyFilter();
      }
    });
  }

  editTask(task: any): void {
     const modal = this.modalService.create({
      nzTitle: 'تعديل المهمة',
      nzContent: TaskModal,
      nzData: {
        title: task.name,
        status: task.status,
        description: ''
      },
      nzFooter: null,
      nzWidth: 500
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        const idx = this.tasks.findIndex(t => t.id === task.id);
        if (idx !== -1) {
          this.tasks[idx] = { ...this.tasks[idx], name: result.title, status: result.status };
          this.applyFilter();
        }
      }
    });
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.applyFilter();
  }
}
