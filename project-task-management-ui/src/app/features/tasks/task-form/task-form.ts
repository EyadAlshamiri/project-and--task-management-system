import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

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
    NzIconModule
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  @Input() taskGroup!: FormGroup;
  @Input() index = 0;
  @Output() remove = new EventEmitter<void>();

  onRemove(): void {
    this.remove.emit();
  }
}
