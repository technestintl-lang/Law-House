export enum DocumentType {
  CONTRACT = 'contract',
  COURT_FILING = 'court_filing',
  CORRESPONDENCE = 'correspondence',
  MEMO = 'memo',
  TEMPLATE = 'template',
  OTHER = 'other',
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  type: DocumentType;
  matterId?: string;
  clientId?: string;
  firmId: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedById: string;
  isTemplate: boolean;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentCreateDto {
  name: string;
  description?: string;
  type: DocumentType;
  matterId?: string;
  clientId?: string;
  firmId: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedById: string;
  isTemplate?: boolean;
  templateId?: string;
}

export interface DocumentUpdateDto {
  name?: string;
  description?: string;
  type?: DocumentType;
  matterId?: string;
  clientId?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  type: DocumentType;
  firmId: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  variables: string[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTemplateCreateDto {
  name: string;
  description?: string;
  type: DocumentType;
  firmId: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  variables: string[];
  createdById: string;
}

