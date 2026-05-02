import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressColor',
  standalone: true
})
export class ProgressColorPipe implements PipeTransform {
  transform(percent: number): string {
    if (percent >= 100) return '#22c55e'; // Green
    if (percent >= 70) return '#10b981'; // Emerald
    if (percent >= 40) return '#f59e0b'; // Amber/Orange
    if (percent >= 20) return '#f97316'; // Orange/Red
    return '#ef4444'; // Red
  }
}
