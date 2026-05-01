import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { TaskModal } from '../../tasks/task-modal/task-modal';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectStatus } from '../../../core/models/project';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';
import { TaskService } from '../../../core/services/task.service';
import { MemberSelectionModal, MemberSelectionData } from '../../../shared/components/member-selection-modal/member-selection-modal';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzDatePickerModule,
    CustomButton
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
  providers: [NzModalService]
})
export class ProjectForm implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NzModalService);
  private userService = inject(UserService);
  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  projectForm!: FormGroup;
  isEditMode = false;
  projectId: number | null = null;

  statuses = [
    { value: ProjectStatus.ACTIVE, label: 'Active' },
    { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
    { value: ProjectStatus.COMPLETED, label: 'Completed' },
  ];

  selectedMembers: User[] = [];
  projectManager: User | null = null;
  showAllTasks = false;

  ngOnInit(): void {
    this.initForm();
    
    // Check for edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.projectId = parseInt(idParam, 10);
      this.loadProjectData(this.projectId);
    }
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3)]],
      description: [null],
      status: [ProjectStatus.ACTIVE, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      priority: ['MEDIUM', [Validators.required]],
      projectManagerName: [null],
      members: [[]],
      tasks: this.fb.array([]),
    });
  }

  private loadProjectData(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        if (project) {
          this.projectForm.patchValue({
            title: project.tilte,
            description: project.description,
            status: project.status,
            priority: project.priority,
            startDate: project.startDate,
            endDate: project.endDate,
            projectManagerName: project.projectManagerName,
            tasksCount: project.tasksCount
          });

          // Load tasks if available
          if (project.tasks) {
            this.tasks.clear();
            project.tasks.forEach(t => {
              const taskForm = this.fb.group({
                title: [t.title, [Validators.required]],
                description: [t.description || ''],
                status: [t.status, [Validators.required]],
                dueDate: [t.dueDate],
                priority: [t.priority],
                assignedTo: [t.assignedTo],
                subTasks: [t.subTasks || []]
              });
              this.tasks.push(taskForm);
            });
          }
          this.cdr.detectChanges();
        }
      }
    });
  }

  get tasks(): FormArray {
    return (this.projectForm?.get('tasks') as FormArray) || this.fb.array([]);
  }

  get visibleTasks(): any[] {
    return this.tasks?.controls?.slice(0, 3) || [];
  }

  trackByIndex(index: number): number {
    return index;
  }

  addTask(): void {
    const modal = this.modalService.create({
      nzTitle: 'إضافة مهمة جديدة',
      nzContent: TaskModal,
      nzData: { task: null, members: this.selectedMembers },
      nzFooter: null,
      nzWidth: 600
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        const taskForm = this.fb.group({
          title: [result.title, [Validators.required]],
          description: [result.description],
          status: [result.status, [Validators.required]],
          dueDate: [result.dueDate],
          priority: [result.priority],
          executorName: [result.executorName],
          subTasks: [result.subTasks || []]
        });
        this.tasks.push(taskForm);
        this.showAllTasks = true;
        this.cdr.detectChanges();
      }
    });
  }

  editTask(index: number): void {
    const task = this.tasks.at(index).value;
    
    const modal = this.modalService.create({
      nzTitle: 'تعديل المهمة',
      nzContent: TaskModal,
      nzData: { task: task, members: this.selectedMembers },
      nzFooter: null,
      nzWidth: 600
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.tasks.at(index).patchValue(result);
        this.cdr.detectChanges();
      }
    });
  }

  removeTask(index: number): void {
    this.tasks.removeAt(index);
    this.cdr.detectChanges();
  }

  openManagerSelectionModal(): void {
    const currentId = this.projectManager?.id ? [this.projectManager.id] : [];
    
    const modal = this.modalService.create({
      nzTitle: 'إختيار مدير المشروع',
      nzContent: MemberSelectionModal,
      nzData: {
        selectedUserIds: currentId,
        singleSelection: true
      } as MemberSelectionData,
      nzFooter: null,
      nzWidth: 480,
      nzBodyStyle: { padding: '16px' }
    });

    modal.afterClose.subscribe((result: number[] | null) => {
      if (result && result.length > 0) {
        this.userService.getUsersByIds(result).subscribe(users => {
          if (users.length > 0) {
            this.projectManager = users[0];
            this.projectForm.patchValue({ projectManagerName: users[0].name });
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  openMemberSelectionModal(): void {
    const currentMemberIds = this.projectForm.get('members')?.value || [];
    
    const modal = this.modalService.create({
      nzTitle: 'إختيار أعضاء الفريق',
      nzContent: MemberSelectionModal,
      nzData: {
        selectedUserIds: currentMemberIds
      } as MemberSelectionData,
      nzFooter: null,
      nzWidth: 480,
      nzBodyStyle: { padding: '16px' }
    });

    modal.afterClose.subscribe((result: number[] | null) => {
      if (result) {
        this.projectForm.patchValue({ members: result });
        this.userService.getUsersByIds(result).subscribe(users => {
          this.selectedMembers = [...users];
          this.cdr.detectChanges();
        });
      }
    });
  }

  submitForm(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      
      const projectData: any = {
        tilte: formValue.title,
        description: formValue.description,
        status: formValue.status,
        startDate: formValue.startDate ? new Date(formValue.startDate).toISOString() : null,
        endDate: formValue.endDate ? new Date(formValue.endDate).toISOString() : null,
        priority: formValue.priority,
        projectManagerName: formValue.projectManagerName,
        members: this.selectedMembers.map(u => u.name),
      };

      if (this.isEditMode && this.projectId) {
        projectData.id = this.projectId;
        this.projectService.updateProject(projectData).subscribe({
          next: () => this.router.navigate(['/projects', this.projectId]),
          error: (err) => console.error('Error updating project:', err)
        });
      } else {
        this.projectService.addProject(projectData).subscribe({
          next: () => this.router.navigate(['/projects']),
          error: (err) => console.error('Error adding project:', err)
        });
      }
    } else {
      Object.values(this.projectForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.projectId) {
      this.router.navigate(['/projects', this.projectId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }
}
