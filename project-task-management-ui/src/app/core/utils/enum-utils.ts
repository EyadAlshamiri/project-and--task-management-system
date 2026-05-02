import { ProjectStatus } from '../models/project';

export class EnumUtils {
  static mapProjectStatus(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'ACTIVE' || s === 'نشط') return 'Active';
    if (s === 'ON HOLD' || s === 'ONHOLD' || s === 'موقوف' || s === 'معلق') return 'OnHold';
    if (s === 'COMPLETED' || s === 'مكتمل') return 'Completed';
    return 'Active';
  }

  static mapPriority(priority: string): string {
    const p = (priority || '').toUpperCase();
    if (p === 'LOW' || p === 'منخفض') return 'Low';
    if (p === 'HIGH' || p === 'عالي') return 'High';
    if (p === 'MEDIUM' || p === 'متوسط') return 'Medium';
    return 'Medium';
  }
}
