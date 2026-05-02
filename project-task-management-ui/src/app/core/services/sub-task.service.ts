import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SubTask } from '../models/task';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class SubTaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/SubTasks`;

  createSubTask(subTask: Partial<SubTask>): Observable<SubTask> {
    return this.http.post<ApiResponse<SubTask>>(this.apiUrl, subTask).pipe(
      map(res => res.data)
    );
  }

  updateSubTask(id: number, subTask: Partial<SubTask>): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}`, subTask).pipe(
      map(res => res.data)
    );
  }

  deleteSubTask(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
