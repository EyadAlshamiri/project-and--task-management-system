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
  tasks: any[] = [];
  filteredTasks: any[] = [];
  isLoading = false;

  constructor(
    private modalService: NzModalService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (res) => {
        this.tasks = res.data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.isLoading = false;
      }
    });
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
        this.taskService.createTask(result).subscribe({
          next: () => this.loadTasks(),
          error: (err) => console.error('Error adding task:', err)
        });
      }
    });
  }

  editTask(task: any): void {
     const modal = this.modalService.create({
      nzTitle: 'تعديل المهمة',
      nzContent: TaskModal,
      nzData: {
        task: task // Pass the whole task object
      },
      nzFooter: null,
      nzWidth: 500
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.taskService.updateTask(task.id, result).subscribe({
          next: () => this.loadTasks(),
          error: (err) => console.error('Error updating task:', err)
        });
      }
    });
  }

  deleteTask(id: number): void {
    this.modalService.confirm({
      nzTitle: 'هل أنت متأكد من حذف هذه المهمة؟',
      nzOnOk: () => {
        this.taskService.deleteTask(id).subscribe({
          next: () => this.loadTasks(),
          error: (err) => console.error('Error deleting task:', err)
        });
      }
    });
  }
}
