export enum MatterStatus {
  OPEN = 'open',
  PENDING = 'pending',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum MatterType {
  LITIGATION = 'litigation',
  CORPORATE = 'corporate',
  REAL_ESTATE = 'real_estate',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  LABOR = 'labor',
  TAX = 'tax',
  OTHER = 'other',
}

export interface Matter {
  id: string;
  title: string;
  description?: string;
  status: MatterStatus;
  type: MatterType;
  clientId: string;
  responsibleAttorneyId: string;
  firmId: string;
  ohadaCaseNumber?: string;
  courtName?: string;
  opposingCounsel?: string;
  openDate: Date;
  closeDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatterCreateDto {
  title: string;
  description?: string;
  status?: MatterStatus;
  type: MatterType;
  clientId: string;
  responsibleAttorneyId: string;
  firmId: string;
  ohadaCaseNumber?: string;
  courtName?: string;
  opposingCounsel?: string;
  openDate?: Date;
}

export interface MatterUpdateDto {
  title?: string;
  description?: string;
  status?: MatterStatus;
  type?: MatterType;
  clientId?: string;
  responsibleAttorneyId?: string;
  ohadaCaseNumber?: string;
  courtName?: string;
  opposingCounsel?: string;
  openDate?: Date;
  closeDate?: Date;
}

