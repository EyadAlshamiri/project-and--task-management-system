import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, SubTask } from '../models/task';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ProjectTasks`;

  getAllTasks(): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(this.apiUrl);
  }

  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/project/${projectId}`).pipe(
      map(res => res.data)
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, task).pipe(
      map(res => res.data)
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}`, task).pipe(
      map(res => res.data)
    );
  }

  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res ? res.data : true)
    );
  }
}
