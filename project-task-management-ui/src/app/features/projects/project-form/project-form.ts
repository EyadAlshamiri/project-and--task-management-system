import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  projectForm!: FormGroup;
  statuses = [
    { value: ProjectStatus.ACTIVE, label: 'Active' },
    { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
    { value: ProjectStatus.COMPLETED, label: 'Completed' },
  ];

  selectedMembers: User[] = [];
  projectManager: User | null = null;
  showAllTasks = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private modalService: NzModalService,
    private userService: UserService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3)]],
      description: [null],
      status: [ProjectStatus.ACTIVE, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      priority: ['MEDIUM', [Validators.required]],
      projectManagerName: [null, [Validators.required]],
      members: [[]],
      tasks: this.fb.array([]),
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

  goToTasksPage(): void {
    const tasksData = this.tasks.value.map((t: any, index: number) => ({
      id: index + 1,
      name: t.title,
      status: t.status,
      selected: false
    }));
    this.taskService.setTasks(tasksData);
    this.router.navigate(['/tasks']);
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
      if (result !== null && result !== undefined && result.length > 0) {
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
      if (result !== null && result !== undefined) {
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
      
      const newProject = {
        title: formValue.title,
        status: formValue.status,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        priority: formValue.priority,
        projectManagerName: formValue.projectManagerName,
        tasksCount: formValue.tasks ? formValue.tasks.length : 0,
        avatars: this.selectedMembers.map(u => u.avatar),
        progress: 0,
        tasks: formValue.tasks ? formValue.tasks.map((t: any, i: number) => ({
          id: i + 1,
          title: t.title,
          status: t.status,
          dueDate: t.dueDate,
          priority: t.priority,
          executorName: t.executorName,
          subTasks: t.subTasks,
          completed: t.status === 'DONE'
        })) : [],
      };

      this.projectService.addProject(newProject);
      this.router.navigate(['/projects']);
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
    this.router.navigate(['/projects']);
  }
}
