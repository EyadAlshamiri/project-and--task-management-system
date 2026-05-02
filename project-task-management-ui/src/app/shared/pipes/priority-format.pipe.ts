import { Pipe, PipeTransform } from '@angular/core';

export type PriorityFormatType = 'label' | 'class' | 'color';

@Pipe({
  name: 'priorityFormat',
  standalone: true
})
export class PriorityFormatPipe implements PipeTransform {
  transform(priority: string | number, format: PriorityFormatType = 'label'): string {
    const p = String(priority || '').toUpperCase();
    
    if (format === 'label') {
      if (p === 'HIGH' || p === 'عالي' || p === '2') return 'عالي';
      if (p === 'MEDIUM' || p === 'متوسط' || p === '1') return 'متوسط';
      if (p === 'LOW' || p === 'منخفض' || p === '0') return 'منخفض';
      return String(priority) || 'غير محدد';
    }
    
    if (format === 'class') {
      if (p === 'HIGH' || p === 'عالي' || p === '2') return 'priority-high';
      if (p === 'MEDIUM' || p === 'متوسط' || p === '1') return 'priority-medium';
      if (p === 'LOW' || p === 'منخفض' || p === '0') return 'priority-low';
      return 'priority-default';
    }

    if (format === 'color') {
      if (p === 'HIGH' || p === 'عالي' || p === '2') return 'red';
      if (p === 'MEDIUM' || p === 'متوسط' || p === '1') return 'orange';
      if (p === 'LOW' || p === 'منخفض' || p === '0') return 'green';
      return 'default';
    }

    return '';
  }
}
