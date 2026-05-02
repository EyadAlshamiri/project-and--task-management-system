import { Pipe, PipeTransform } from '@angular/core';

export type StatusFormatType = 'label' | 'class' | 'color';

@Pipe({
  name: 'statusFormat',
  standalone: true
})
export class StatusFormatPipe implements PipeTransform {
  transform(status: string, format: StatusFormatType = 'label'): string {
    const s = (status || '').toUpperCase();
    
    if (format === 'label') {
      if (s === 'ACTIVE' || s === 'نشط') return 'نشط';
      if (s === 'ON HOLD' || s === 'ONHOLD' || s === 'موقوف' || s === 'معلق') return 'معلق';
      if (s === 'COMPLETED' || s === 'مكتمل') return 'مكتمل';
      if (s === 'TODO' || s === 'قيد الانتظار') return 'قيد الانتظار';
      if (s === 'IN_PROGRESS' || s === 'قيد التنفيذ') return 'قيد التنفيذ';
      if (s === 'DONE' || s === 'منجز') return 'منجز';
      if (s === 'ALL' || s === 'الكل') return 'الكل';
      return status || 'غير معروف';
    }
    
    if (format === 'class') {
      if (s === 'ACTIVE' || s === 'نشط') return 'status-active';
      if (s === 'ON HOLD' || s === 'ONHOLD' || s === 'موقوف') return 'status-hold';
      if (s === 'COMPLETED' || s === 'مكتمل' || s === 'DONE' || s === 'منجز') return 'status-completed';
      if (s === 'IN_PROGRESS' || s === 'قيد التنفيذ') return 'status-progress';
      return 'status-default';
    }

    if (format === 'color') {
      if (s === 'ACTIVE' || s === 'نشط') return 'blue';
      if (s === 'ON HOLD' || s === 'ONHOLD' || s === 'موقوف') return 'orange';
      if (s === 'COMPLETED' || s === 'مكتمل' || s === 'DONE' || s === 'منجز') return 'green';
      if (s === 'IN_PROGRESS' || s === 'قيد التنفيذ') return 'processing';
      if (s === 'TODO' || s === 'قيد الانتظار') return 'default';
      return 'default';
    }

    return '';
  }
}
