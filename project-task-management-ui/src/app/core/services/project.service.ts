import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../models/project';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Projects`;

  getProjects(): Observable<Project[]> {
    return this.http.get<ApiResponse<Project[]>>(this.apiUrl).pipe(
      tap(res => console.log('✅ API Response:', res)),
      map(res => res?.data ?? []),
      catchError(err => {
        console.error('❌ API Error:', err);
        return of([]);
      })
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  addProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<ApiResponse<Project>>(this.apiUrl, project).pipe(
      map(res => res.data)
    );
  }

  updateProject(project: Project): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${project.id}`, project).pipe(
      map(res => res.data)
    );
  }

  deleteProject(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
