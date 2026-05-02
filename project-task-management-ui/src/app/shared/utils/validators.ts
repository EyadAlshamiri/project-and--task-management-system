import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AppValidators {
  static dateRange(startDateControlName: string, endDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const start = control.get(startDateControlName)?.value;
      const end = control.get(endDateControlName)?.value;
      
      if (start && end && new Date(start) > new Date(end)) {
        return { dateRangeInvalid: true };
      }
      return null;
    };
  }
}
