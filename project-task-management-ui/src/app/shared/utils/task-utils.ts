import { FormArray, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export class TaskUtils {
  static setupAutoCompletion(taskGroup: FormGroup, destroy$: Subject<void>): void {
    const subTasksArray = taskGroup.get('subTasks') as FormArray;
    if (!subTasksArray) return;

    subTasksArray.valueChanges.pipe(takeUntil(destroy$)).subscribe((subTasks: any[]) => {
      const validSubTasks = subTasks.filter(st => st.title || st.assignedTo);
      if (validSubTasks.length > 0) {
        const allDone = validSubTasks.every(st => st.isCompleted);
        const currentStatus = taskGroup.get('status')?.value;
        
        if (allDone && currentStatus !== 'DONE') {
          taskGroup.patchValue({ status: 'DONE' }, { emitEvent: false });
        } else if (!allDone && currentStatus === 'DONE') {
          taskGroup.patchValue({ status: 'IN_PROGRESS' }, { emitEvent: false });
        }
      }
    });
  }
}
