import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzCheckboxModule,
    CustomButton
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private fb = inject(FormBuilder);
  
  @Input() taskGroup!: FormGroup;
  @Input() index = 0;
  @Input() projectMembers: string[] = [];
  @Output() remove = new EventEmitter<void>();

  getSubTasks(): FormArray {
    return this.taskGroup.get('subTasks') as FormArray;
  }

  addSubTask(): void {
    const subTaskGroup = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      isCompleted: [false],
      assignedTo: [null]
    });
    this.getSubTasks().push(subTaskGroup);
  }

  removeSubTask(index: number): void {
    this.getSubTasks().removeAt(index);
  }

  onRemove(): void {
    this.remove.emit();
  }
}
