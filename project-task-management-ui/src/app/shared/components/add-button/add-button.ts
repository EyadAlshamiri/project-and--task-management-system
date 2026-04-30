import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-add-button',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './add-button.html',
  styleUrl: './add-button.css',
})
export class AddButton {
  @Input() label: string = 'أنشئ مشروع جديد ';
  @Input() icon: string = 'plus';
  @Input() size: 'large' | 'default' | 'small' = 'default';
  @Output() addClick = new EventEmitter<void>();

  onAddClick(): void {
    this.addClick.emit();
  }
}

