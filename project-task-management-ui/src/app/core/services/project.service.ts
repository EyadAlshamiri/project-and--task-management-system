import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
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
      tap(res => console.log('✅ API Response: - project.service.ts:17', res)),
      map(res => {
        console.log('Data: - project.service.ts:19', res?.data);
        return (res?.data ?? []).map(project => ({
          ...project,
          tilte: project.tilte || '',
          members: project.members || [],
          progress: project.progress || 0,
          tasksCount: project.tasksCount || 0
        }));
      })
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        if (res.data) {
          res.data.tilte = res.data.tilte || '';
        }
        return res.data;
      })
    );
  }

  addProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<ApiResponse<Project>>(this.apiUrl, project).pipe(
      map(res => res.data)
    );
  }

  updateProject(id: number, projectData: any): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}`, projectData).pipe(
      map(res => res.data)
    );
  }

  deleteProject(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
