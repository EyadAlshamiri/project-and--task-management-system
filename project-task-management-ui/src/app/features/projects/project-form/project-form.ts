import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Observable } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { TaskModal } from '../../tasks/task-modal/task-modal';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectStatus } from '../../../core/models/project';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';
import { TaskService } from '../../../core/services/task.service';
import { MemberSelectionModal, MemberSelectionData } from '../../../shared/components/member-selection-modal/member-selection-modal';
import { EnumUtils } from '../../../core/utils/enum-utils';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';
import { PriorityFormatPipe } from '../../../shared/pipes/priority-format.pipe';

import { AppValidators } from '../../../shared/utils/validators';

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
    CustomButton,
    StatusFormatPipe,
    PriorityFormatPipe,
    NzTagModule
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
  private messageService = inject(NzMessageService);

  projectForm!: FormGroup;
  isEditMode = false;
  projectId: number | null = null;
  isSubmitting = false;

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
      status: ['Active', [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      priority: ['Medium', [Validators.required]],
      projectManagerName: [null],
      members: [[]],
      tasks: this.fb.array([]),
    }, { validators: [AppValidators.dateRange('startDate', 'endDate')] });
  }

  private loadProjectData(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        if (project) {
          const pStatus = EnumUtils.mapProjectStatus(project.status);
          const pPriority = EnumUtils.mapPriority(project.priority);

          this.projectForm.patchValue({
            title: project.tilte || project.tilte || '',
            description: project.description,
            status: pStatus,
            priority: pPriority,
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            projectManagerName: project.projectManagerName,
            tasksCount: project.tasksCount
          });

          // Load Manager Object
          if (project.projectManagerName) {
            this.userService.getUsersByNames([project.projectManagerName]).subscribe(users => {
              if (users.length > 0) this.projectManager = users[0];
            });
          }

          // Load Members Objects
          if (project.members && project.members.length > 0) {
            this.userService.getUsersByNames(project.members).subscribe(users => {
              this.selectedMembers = [...users];
              this.projectForm.patchValue({ members: users.map(u => u.id) });
            });
          }

          // Load tasks if available
          if (project.tasks) {
            this.tasks.clear();
            project.tasks.forEach(t => {
              const taskForm = this.fb.group({
                id: [t.id || null],
                title: [t.title, [Validators.required]],
                description: [t.description || ''],
                status: [t.status, [Validators.required]],
                startDate: [t.startDate ? new Date(t.startDate) : new Date(), [Validators.required]],
                dueDate: [t.dueDate ? new Date(t.dueDate) : null],
                priority: [t.priority],
                assignedTo: [t.assignedTo],
                subTasks: this.fb.array([])
              });

              if (t.subTasks && Array.isArray(t.subTasks) && t.subTasks.length > 0) {
                t.subTasks.forEach((st: any) => {
                  (taskForm.get('subTasks') as FormArray).push(this.fb.group({
                    id: [st.id || 0],
                    title: [st.title, Validators.required],
                    isCompleted: [st.isCompleted || false],
                    assignedTo: [st.assignedTo || null]
                  }));
                });
              }

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

  private buildTaskPayload(task: any, projectId: number): any {
    return {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: Number(task.priority),
      startDate: task.startDate ? new Date(task.startDate).toISOString() : new Date().toISOString(),
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
      assignedTo: task.assignedTo,
      projectId
    };
  }

  private createPendingTasks(projectId: number): Observable<any> {
    const newTasks = this.tasks.controls
      .map(control => control.value)
      .filter(task => !task.id);

    if (!newTasks.length) {
      return of(null);
    }

    const requests = newTasks.map(task =>
      this.taskService.createTask(this.buildTaskPayload(task, projectId))
    );

    return forkJoin(requests);
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
          id: [null],
          title: [result.title, [Validators.required]],
          description: [result.description],
          status: [result.status, [Validators.required]],
          startDate: [result.startDate ? new Date(result.startDate) : new Date(), [Validators.required]],
          dueDate: [result.dueDate],
          priority: [result.priority],
          assignedTo: [result.assignedTo],
          subTasks: this.fb.array([])
        });

        if (result.subTasks && Array.isArray(result.subTasks)) {
          result.subTasks.forEach((st: any) => {
            (taskForm.get('subTasks') as FormArray).push(this.fb.group({
              id: [st.id || 0],
              title: [st.title, Validators.required],
              isCompleted: [st.isCompleted || false],
              assignedTo: [st.assignedTo || null]
            }));
          });
        }

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
        if (task.id) {
          const taskData = { ...result, projectId: this.projectId };
          this.taskService.updateTask(task.id, taskData).subscribe({
            next: () => {
              this.syncSubTasksArray(index, result.subTasks);
              this.tasks.at(index).patchValue(result);
              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error updating task in projectform: - project-form.ts:229', err)
          });
        } else {
          this.syncSubTasksArray(index, result.subTasks);
          this.tasks.at(index).patchValue(result);
          this.cdr.detectChanges();
        }
      }
    });
  }

  private syncSubTasksArray(taskIndex: number, subTasksData: any[]): void {
    const taskGroup = this.tasks.at(taskIndex) as FormGroup;
    const subTasksArray = taskGroup.get('subTasks') as FormArray;
    subTasksArray.clear();
    if (subTasksData && Array.isArray(subTasksData) && subTasksData.length > 0) {
      subTasksData.forEach((st: any) => {
        subTasksArray.push(this.fb.group({
          id: [st.id || 0],
          title: [st.title, Validators.required],
          isCompleted: [st.isCompleted || false],
          assignedTo: [st.assignedTo || null]
        }));
      });
    }
  }

  removeTask(index: number): void {
    const task = this.tasks.at(index).value;
    if (task.id) {
      this.modalService.confirm({
        nzTitle: 'هل أنت متأكد من حذف هذه المهمة من قاعدة البيانات؟',
        nzOnOk: () => {
          this.taskService.deleteTask(task.id).subscribe({
            next: () => {
              this.tasks.removeAt(index);
              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error deleting task from projectform: - project-form.ts:250', err)
          });
        }
      });
    } else {
      this.tasks.removeAt(index);
      this.cdr.detectChanges();
    }
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

      // Business Logic: Prevent completing project if tasks are pending
      if (formValue.status === 'Completed') {
        const hasPendingTasks = formValue.tasks && formValue.tasks.some((t: any) => 
          t.status !== 'DONE' && t.status !== 'Completed' && t.status !== 'مكتمل' && t.status !== 'منجز'
        );
        if (hasPendingTasks) {
          this.messageService.error('لا يمكنك إكمال المشروع وهناك مهام غير منجزة!');
          return;
        }
      }

      this.isSubmitting = true;

      if (this.isEditMode && this.projectId) {
        this.projectService.updateProject(this.projectId, projectData).subscribe({
          next: () => {
            this.createPendingTasks(this.projectId!).subscribe({
              next: () => {
                this.isSubmitting = false;
                this.messageService.success('تم تحديث المشروع بنجاح');
                this.router.navigate(['/projects', this.projectId]);
              },
              error: (err: any) => {
                this.isSubmitting = false;
                console.error('Error creating project tasks after update: - project-form.ts:334', err);
                this.messageService.success('تم تحديث المشروع بنجاح مع وجود مشاكل في إنشاء بعض المهام');
                this.router.navigate(['/projects', this.projectId]);
              }
            });
          },
          error: (err) => {
            this.isSubmitting = false;
            console.error('Error updating project: - project-form.ts:339', err);
          }
        });
      } else {
        this.projectService.addProject(projectData).subscribe({
          next: (createdProject) => {
            const projectId = createdProject.id;
            this.createPendingTasks(projectId).subscribe({
              next: () => {
                this.isSubmitting = false;
                this.messageService.success('تم إنشاء المشروع بنجاح');
                this.router.navigate(['/projects']);
              },
              error: (err: any) => {
                this.isSubmitting = false;
                console.error('Error creating project tasks after add: - project-form.ts:348', err);
                this.messageService.success('تم إنشاء المشروع بنجاح مع وجود مشاكل في إضافة بعض المهام');
                this.router.navigate(['/projects']);
              }
            });
          },
          error: (err) => {
            this.isSubmitting = false;
            console.error('Error adding project: - project-form.ts:353', err);
          }
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
