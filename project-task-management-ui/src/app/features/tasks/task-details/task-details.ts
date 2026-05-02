import { Component, OnInit, inject, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { SubTaskService } from '../../../core/services/sub-task.service';
import { Task, SubTask } from '../../../core/models/task';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';
import { PriorityFormatPipe } from '../../../shared/pipes/priority-format.pipe';

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
    NzSpinModule,
    NzModalModule,
    NzCheckboxModule,
    NzInputModule,
    NzSelectModule,
    FormsModule,
    CustomButton,
    StatusFormatPipe,
    PriorityFormatPipe
  ],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {
  @ViewChild('addSubTaskTpl') addSubTaskTpl!: TemplateRef<any>;
  
  newSubTask = { title: '', assignedTo: '' };
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private subTaskService = inject(SubTaskService);
  private modalService = inject(NzModalService);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  task: Task | undefined;
  projectMembers: string[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = parseInt(idParam, 10);
        this.isLoading = true;
        this.taskService.getTaskById(id).subscribe({
          next: (task) => {
            console.log('✅ Task Loaded:', task);
            this.task = task;
            this.isLoading = false;
            
            // Fetch project members
            this.projectService.getProjectById(task.projectId).subscribe(project => {
              if (project && project.members) {
                this.projectMembers = project.members;
              }
              this.cdr.detectChanges();
            });
            
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('❌ Error loading task:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  toggleSubTaskStatus(sub: SubTask): void {
    if (!sub.id) return;
    
    const newStatus = !sub.isCompleted;
    this.subTaskService.updateSubTask(sub.id, { ...sub, isCompleted: newStatus }).subscribe({
      next: () => {
        sub.isCompleted = newStatus;
        this.message.success(newStatus ? 'تم إكمال المهمة الفرعية' : 'تم إلغاء إكمال المهمة الفرعية');
        this.cdr.detectChanges();
      },
      error: () => {
        this.message.error('فشل في تحديث حالة المهمة الفرعية');
      }
    });
  }

  addSubTask(): void {
    setTimeout(() => {
      // Reset values
      this.newSubTask = { title: '', assignedTo: '' };

      const modal = this.modalService.create({
        nzTitle: 'إضافة مهمة فرعية جديدة',
        nzContent: this.addSubTaskTpl,
        nzOnOk: () => {
          if (!this.newSubTask.title) {
            this.message.warning('يرجى إدخال عنوان للمهمة الفرعية');
            return false;
          }

          if (this.task) {
            this.subTaskService.createSubTask({
              title: this.newSubTask.title,
              assignedTo: this.newSubTask.assignedTo,
              isCompleted: false,
              taskId: this.task.id
            }).subscribe({
              next: (newSub) => {
                if (this.task?.subTasks) {
                  this.task.subTasks.push(newSub);
                } else if (this.task) {
                  this.task.subTasks = [newSub];
                }
                this.message.success('تمت إضافة المهمة الفرعية بنجاح');
                this.cdr.detectChanges();
              },
              error: () => this.message.error('فشل في إضافة المهمة الفرعية')
            });
          }
          return true;
        }
      });
    });
  }

  editSubTask(sub: SubTask): void {
    if (!sub.id) return;
    
    setTimeout(() => {
      // Fill values for editing
      this.newSubTask = { title: sub.title, assignedTo: sub.assignedTo || '' };

      const modal = this.modalService.create({
        nzTitle: 'تعديل المهمة الفرعية',
        nzContent: this.addSubTaskTpl,
        nzOnOk: () => {
          if (!this.newSubTask.title) {
            this.message.warning('يرجى إدخال عنوان للمهمة الفرعية');
            return false;
          }

          this.subTaskService.updateSubTask(sub.id!, { 
            ...sub, 
            title: this.newSubTask.title, 
            assignedTo: this.newSubTask.assignedTo 
          }).subscribe({
            next: () => {
              sub.title = this.newSubTask.title;
              sub.assignedTo = this.newSubTask.assignedTo;
              this.message.success('تم تحديث المهمة الفرعية');
              this.cdr.detectChanges();
            },
            error: () => this.message.error('فشل في تحديث المهمة الفرعية')
          });
          return true;
        }
      });
    });
  }

  deleteSubTask(sub: SubTask): void {
    if (!sub.id) return;

    this.modalService.confirm({
      nzTitle: 'هل أنت متأكد من حذف هذه المهمة الفرعية؟',
      nzContent: `<b style="color: red;">سيتم حذف "${sub.title}" نهائياً.</b>`,
      nzOkText: 'نعم، احذف',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'إلغاء',
      nzOnOk: () => {
        this.subTaskService.deleteSubTask(sub.id!).subscribe({
          next: () => {
            if (this.task?.subTasks) {
              this.task.subTasks = this.task.subTasks.filter(s => s.id !== sub.id);
            }
            this.message.success('تم حذف المهمة الفرعية بنجاح');
            this.cdr.detectChanges();
          },
          error: () => this.message.error('فشل في حذف المهمة الفرعية')
        });
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks/edit-task', this.task.id]);
    }
  }


}
