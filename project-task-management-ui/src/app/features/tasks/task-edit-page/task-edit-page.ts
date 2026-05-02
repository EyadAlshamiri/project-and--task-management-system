import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { TaskForm } from '../task-form/task-form';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-task-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskForm, CustomButton],
  template: `
    <div class="page-container">
      <div class="form-container">
        <h2 class="page-title">تعديل المهمة</h2>

        <div *ngIf="isLoading" class="loading-state">
          جاري جلب مهمة التحرير...
        </div>

        <div *ngIf="!isLoading && editForm" class="edit-card">
          <app-task-form [taskGroup]="editForm" [index]="0" [projectMembers]="projectMembers"></app-task-form>
          <div class="footer-actions">
            <app-custom-button label="تحديث" type="primary" (btnClick)="save()"></app-custom-button>
            <app-custom-button label="إلغاء" type="default" (btnClick)="cancel()"></app-custom-button>
          </div>
        </div>

        <div *ngIf="!isLoading && !editForm" class="empty-state">
          لم يتم العثور على المهمة.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 40px; background: var(--primary-light); min-height: 100vh; }
    .form-container { max-width: 600px; margin: 0 auto; }
    .page-title { text-align: center; margin-bottom: 30px; font-weight: 700; }
    .edit-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .footer-actions { display: flex; justify-content: center; gap: 16px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
  `]
})
export class TaskEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);

  editForm?: FormGroup;
  taskId?: number;
  projectMembers: string[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      status: ['TODO', Validators.required],
      priority: [0],
      startDate: [new Date(), Validators.required],
      dueDate: [null],
      assignedTo: [null],
      description: [''],
      subTasks: this.fb.array([])
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.taskId = parseInt(idParam, 10);
        this.taskService.getTaskById(this.taskId).subscribe({
          next: task => {
            if (task) {
              this.editForm?.patchValue({
                title: task.title,
                status: task.status || 'TODO',
                priority: task.priority ?? 0,
                startDate: task.startDate ? new Date(task.startDate) : new Date(),
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
                assignedTo: task.assignedTo ?? null,
                description: task.description ?? ''
              });

              // Clear and Fill SubTasks
              const subTasksArray = this.editForm?.get('subTasks') as FormArray;
              if (task.subTasks && task.subTasks.length > 0) {
                task.subTasks.forEach((st: any) => {
                  subTasksArray.push(this.fb.group({
                    id: [st.id || 0],
                    title: [st.title, Validators.required],
                    isCompleted: [st.isCompleted || false],
                    assignedTo: [st.assignedTo || null]
                  }));
                });
              } else {
                // Add one empty row if none exist
                subTasksArray.push(this.fb.group({
                  id: [0],
                  title: ['', Validators.required],
                  isCompleted: [false],
                  assignedTo: [null]
                }));
              }

              // Fetch project members
              this.projectService.getProjectById(task.projectId).subscribe(project => {
                if (project && project.members) {
                  this.projectMembers = project.members;
                  this.cdr.detectChanges();
                }
              });
            }
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  save(): void {
    if (this.editForm?.valid && this.taskId) {
      this.taskService.updateTask(this.taskId, this.editForm.value).subscribe(() => {
        window.history.back();
      });
    }
  }

  cancel(): void {
    window.history.back();
  }
}
