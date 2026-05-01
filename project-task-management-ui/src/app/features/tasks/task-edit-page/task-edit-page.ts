import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { TaskForm } from '../task-form/task-form';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-task-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskForm, CustomButton],
  template: `
    <div class="page-container">
      <div class="form-container">
        <h2 class="page-title">تعديل المهمة</h2>
        <div *ngIf="editForm" class="edit-card">
          <app-task-form [taskGroup]="editForm"></app-task-form>
          <div class="footer-actions">
            <app-custom-button label="تحديث" type="primary" (btnClick)="save()"></app-custom-button>
            <app-custom-button label="إلغاء" type="default" (btnClick)="cancel()"></app-custom-button>
          </div>
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
  private projectService = inject(ProjectService);

  editForm?: FormGroup;
  taskId?: number;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.taskId = parseInt(idParam, 10);
      const task = this.projectService.getTaskById(this.taskId);
      if (task) {
        this.editForm = this.fb.group({
          title: [task.title, Validators.required],
          status: [task.status, Validators.required],
          priority: [task.priority],
          dueDate: [task.dueDate],
          description: [task.description]
        });
      }
    }
  }

  save(): void {
    if (this.editForm?.valid && this.taskId) {
      // In a real app, we'd update via service
      // For now, let's just go back
      window.history.back();
    }
  }

  cancel(): void {
    window.history.back();
  }
}
