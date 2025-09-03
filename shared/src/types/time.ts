export interface TimeEntry {
  id: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // Duration in seconds
  matterId: string;
  userId: string;
  firmId: string;
  billable: boolean;
  billed: boolean;
  invoiceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntryCreateDto {
  description: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // Duration in seconds
  matterId: string;
  userId: string;
  firmId: string;
  billable?: boolean;
}

export interface TimeEntryUpdateDto {
  description?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // Duration in seconds
  matterId?: string;
  billable?: boolean;
  billed?: boolean;
  invoiceId?: string;
}

