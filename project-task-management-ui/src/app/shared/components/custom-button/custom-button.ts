import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-custom-button',
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.css',
})
export class CustomButton {
  @Input() label: string = 'Button';
  @Input() type: 'primary' | 'default' | 'dashed' | 'link' | 'text' = 'primary';
  @Input() disabled: boolean = false;
  @Input() htmlType: 'button' | 'submit' | 'reset' = 'button';
  @Input() block: boolean = false;
  @Input() danger: boolean = false;
  @Input() size: 'large' | 'default' | 'small' = 'default';
  @Input() icon: string = '';
  @Output() btnClick = new EventEmitter<Event>();

  onClick(event: Event): void {
    if (!this.disabled) {
      this.btnClick.emit(event);
    }
  }
}
