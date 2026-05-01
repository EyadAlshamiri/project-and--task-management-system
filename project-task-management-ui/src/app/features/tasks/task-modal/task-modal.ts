import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzIconModule,
    NzDividerModule,
    CustomButton
  ],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css'
})
export class TaskModal implements OnInit {
  taskForm!: FormGroup;
  isEdit = false;
  projectMembers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const taskData = this.data?.task || (this.data?.title ? this.data : null);
    this.projectMembers = this.data?.members || [];
    this.isEdit = !!taskData;
    
    this.taskForm = this.fb.group({
      title: [taskData?.title || null, [Validators.required]],
      description: [taskData?.description || null],
      status: [taskData?.status || 'TODO', [Validators.required]],
      dueDate: [taskData?.dueDate || null],
      priority: [taskData?.priority || 'MEDIUM'],
      assignedTo: [taskData?.assignedTo || null],
      subTasks: this.fb.array([])
    });

    if (taskData?.subTasks && Array.isArray(taskData.subTasks)) {
      taskData.subTasks.forEach((subTask: any) => {
        this.addSubTask(subTask);
      });
    } else if (!this.isEdit) {
      // Add one empty subtask by default for new tasks
      this.addSubTask();
    }
  }

  get subTasks(): FormArray {
    return this.taskForm.get('subTasks') as FormArray;
  }

  addSubTask(subTaskData?: any): void {
    const subTaskGroup = this.fb.group({
      title: [subTaskData?.title || null, [Validators.required]],
      isCompleted: [subTaskData?.isCompleted || false],
      assignedTo: [subTaskData?.assignedTo || null]
    });
    this.subTasks.push(subTaskGroup);
  }

  removeSubTask(index: number): void {
    this.subTasks.removeAt(index);
  }

  submit(): void {
    if (this.taskForm.valid) {
      this.modalRef.destroy(this.taskForm.value);
    } else {
      Object.values(this.taskForm.controls).forEach(control => {
        if (control instanceof FormArray) {
          control.controls.forEach(c => {
            if (c instanceof FormGroup) {
              Object.values(c.controls).forEach(subCtrl => {
                subCtrl.markAsDirty();
                subCtrl.updateValueAndValidity({ onlySelf: true });
              });
            }
          });
        } else {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancel(): void {
    this.modalRef.destroy(null);
  }
}
