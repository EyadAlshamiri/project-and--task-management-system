import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
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
    CustomButton
  ],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css'
})
export class TaskModal implements OnInit {
  taskForm!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.taskForm = this.fb.group({
      title: [this.data?.title || null, [Validators.required]],
      description: [this.data?.description || null],
      status: [this.data?.status || 'TODO', [Validators.required]]
    });
  }

  submit(): void {
    if (this.taskForm.valid) {
      this.modalRef.destroy(this.taskForm.value);
    } else {
      Object.values(this.taskForm.controls).forEach(control => {
        if (control.invalid) {
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
