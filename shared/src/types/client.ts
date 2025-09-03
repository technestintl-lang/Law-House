export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  contactPerson?: string;
  notes?: string;
  firmId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientCreateDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  contactPerson?: string;
  notes?: string;
  firmId: string;
}

export interface ClientUpdateDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  contactPerson?: string;
  notes?: string;
}

