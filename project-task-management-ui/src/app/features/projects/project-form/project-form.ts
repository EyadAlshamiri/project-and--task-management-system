import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalService } from 'ng-zorro-antd/modal';
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
    NzCardModule,
    CustomButton
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
  providers: [NzModalService] // Provide service at component level if not provided globally
})
export class ProjectForm implements OnInit {
  projectForm!: FormGroup;
  statuses = [
    { value: ProjectStatus.ACTIVE, label: 'Active' },
    { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
    { value: ProjectStatus.COMPLETED, label: 'Completed' },
  ];

  selectedMembers: User[] = [];
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
      members: [[]], // Array of selected user IDs
      tasks: this.fb.array([]), // Dynamic tasks array
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
    // Map FormArray values to the format expected by TaskList
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
      nzFooter: null,
      nzWidth: 500
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        const taskForm = this.fb.group({
          title: [result.title, [Validators.required]],
          description: [result.description],
          status: [result.status, [Validators.required]]
        });
        this.tasks.push(taskForm);
        this.showAllTasks = true; // Expand to show the newly added task
        this.cdr.detectChanges(); // Ensure UI updates immediately
      }
    });
  }

  editTask(index: number): void {
    const task = this.tasks.at(index).value;
    
    const modal = this.modalService.create({
      nzTitle: 'تعديل المهمة',
      nzContent: TaskModal,
      nzData: task,
      nzFooter: null,
      nzWidth: 500
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.tasks.at(index).patchValue(result);
        this.cdr.detectChanges(); // Ensure UI updates immediately
      }
    });
  }

  removeTask(index: number): void {
    this.tasks.removeAt(index);
    this.cdr.detectChanges();
  }


  openMemberSelectionModal(): void {
    const currentMemberIds = this.projectForm.get('members')?.value || [];
    
    const modal = this.modalService.create({
      nzTitle: 'إختيار أعضاء الفريق',
      nzContent: MemberSelectionModal,
      nzData: {
        selectedUserIds: currentMemberIds
      } as MemberSelectionData,
      nzFooter: null, // Modal has its own footer
      nzWidth: 480,
      nzBodyStyle: { padding: '16px' }
    });

    modal.afterClose.subscribe((result: number[] | null) => {
      if (result !== null && result !== undefined) {
        // Update form control
        this.projectForm.patchValue({ members: result });
        
        // Fetch full user objects for display
        this.userService.getUsersByIds(result).subscribe(users => {
          this.selectedMembers = [...users]; // New reference
          this.cdr.detectChanges(); // Force UI update
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
        tasksCount: formValue.tasks ? formValue.tasks.length : 0,
        // Map selected users to just their avatar URLs for the project model
        avatars: this.selectedMembers.map(u => u.avatar),
        progress: 0,
        tasks: formValue.tasks ? formValue.tasks.map((t: any, i: number) => ({
          id: i + 1,
          title: t.title,
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
