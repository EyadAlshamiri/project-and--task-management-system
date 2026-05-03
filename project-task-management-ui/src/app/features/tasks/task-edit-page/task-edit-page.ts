import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskUtils } from '../../../shared/utils/task-utils';
import { TaskService } from '../../../core/services/task.service';
import { TaskForm } from '../task-form/task-form';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { ProjectService } from '../../../core/services/project.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskForm, CustomButton],
  templateUrl: './task-edit-page.html',
  styleUrl: './task-edit-page.css',
})
export class TaskEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(NzMessageService);

  editForm?: FormGroup;
  taskId?: number;
  projectMembers: string[] = [];
  private destroy$ = new Subject<void>();
  isLoading = true;
  isSubmitting = false;

  ngOnInit(): void {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      status: ['TODO', Validators.required],
      priority: [0],
      startDate: [new Date(), Validators.required],
      dueDate: [null],
      assignedTo: [null],
      description: [''],
      subTasks: this.fb.array([]),
    });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.taskId = parseInt(idParam, 10);
        this.taskService.getTaskById(this.taskId).subscribe({
          next: (task) => {
            setTimeout(() => {
              if (task) {
                this.editForm?.patchValue({
                  title: task.title,
                  status: task.status || 'TODO',
                  priority: task.priority ?? 0,
                  startDate: task.startDate ? new Date(task.startDate) : new Date(),
                  dueDate: task.dueDate ? new Date(task.dueDate) : null,
                  assignedTo: task.assignedTo ?? null,
                  description: task.description ?? '',
                });

                // Clear and Fill SubTasks
                const subTasksArray = this.editForm?.get('subTasks') as FormArray;
                if (task.subTasks && task.subTasks.length > 0) {
                  task.subTasks.forEach((st: any) => {
                    subTasksArray.push(
                      this.fb.group({
                        id: [st.id || 0],
                        title: [st.title, Validators.required],
                        isCompleted: [st.isCompleted || false],
                        assignedTo: [st.assignedTo || null],
                      }),
                    );
                  });
                } else {
                  // Add one empty row if none exist
                  subTasksArray.push(
                    this.fb.group({
                      id: [0],
                      title: ['', Validators.required],
                      isCompleted: [false],
                      assignedTo: [null],
                    }),
                  );
                }

                // Auto-completion logic
                TaskUtils.setupAutoCompletion(this.editForm!, this.destroy$);

                // Fetch project members
                this.projectService.getProjectById(task.projectId).subscribe((project) => {
                  if (project && project.members) {
                    this.projectMembers = project.members;
                    this.cdr.detectChanges();
                  }
                });
              }
              this.isLoading = false;
              this.cdr.detectChanges();
            });
          },
          error: () => {
            setTimeout(() => {
              this.isLoading = false;
              this.cdr.detectChanges();
            });
          },
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save(): void {
    if (this.editForm) {
      const subTasks = this.editForm.get('subTasks') as FormArray;
      for (let i = subTasks.length - 1; i >= 0; i--) {
        const sub = subTasks.at(i);
        if (!sub.value.title && !sub.value.assignedTo) {
          subTasks.removeAt(i);
        }
      }
    }

    if (this.editForm?.valid && this.taskId) {
      this.isSubmitting = true;
      this.taskService.updateTask(this.taskId, this.editForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.messageService.success('تم تحديث المهمة بنجاح');
          window.history.back();
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
    }
  }

  cancel(): void {
    window.history.back();
  }
}
