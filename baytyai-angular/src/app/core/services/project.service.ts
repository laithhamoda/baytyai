import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateProjectRequest, ProjectDto, SaveStepRequest } from '../models/project.models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects(orgId: string) {
    return this.http.get<ProjectDto[]>(`${environment.apiUrl}/organizations/${orgId}/projects`);
  }

  createProject(orgId: string, data: CreateProjectRequest) {
    return this.http.post<ProjectDto>(`${environment.apiUrl}/organizations/${orgId}/projects`, data);
  }

  saveStep(orgId: string, projectId: string, data: SaveStepRequest) {
    return this.http.put<void>(
      `${environment.apiUrl}/organizations/${orgId}/projects/${projectId}/steps`, data);
  }

  submitProject(orgId: string, projectId: string) {
    return this.http.post<void>(
      `${environment.apiUrl}/organizations/${orgId}/projects/${projectId}/submit`, {});
  }
}
