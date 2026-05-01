import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private currentTasksSubject = new BehaviorSubject<any[]>([]);
  currentTasks$ = this.currentTasksSubject.asObservable();

  setTasks(tasks: any[]): void {
    this.currentTasksSubject.next(tasks);
  }

  getTasks(): any[] {
    return this.currentTasksSubject.value;
  }
}
