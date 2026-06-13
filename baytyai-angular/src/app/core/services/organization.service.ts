import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateOrganizationRequest, InviteMemberRequest, MemberDto, OrganizationDto } from '../models/organization.models';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  constructor(private http: HttpClient) {}

  createOrganization(data: CreateOrganizationRequest) {
    return this.http.post<OrganizationDto>(`${environment.apiUrl}/organizations`, data);
  }

  inviteMember(orgId: string, data: InviteMemberRequest) {
    return this.http.post<void>(`${environment.apiUrl}/organizations/${orgId}/members/invite`, data);
  }

  acceptInvitation(token: string) {
    return this.http.post<void>(`${environment.apiUrl}/organizations/invitations/accept`, { token });
  }
}
