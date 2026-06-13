export interface CreateProjectRequest {
  title: string;
  projectType: string;
  location: string;
  budgetAed?: number;
  description?: string;
}

export interface SaveStepRequest {
  stepNumber: number;
  dataJson: string;
}

export interface ProjectDto {
  id: string;
  title: string;
  projectType: string;
  location: string;
  budgetAed?: number;
  status: ProjectStatus;
  currentStep: number;
  createdAt: string;
  submittedAt?: string;
  documents: ProjectDocumentDto[];
}

export interface ProjectDocumentDto {
  id: string;
  fileName: string;
  documentType: string;
  fileSizeBytes: number;
  createdAt: string;
}

export enum ProjectStatus {
  Draft = 1,
  Submitted = 2,
  UnderReview = 3,
  Approved = 4,
  Rejected = 5
}
