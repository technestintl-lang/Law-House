export enum DeadlineType {
  COURT_APPEARANCE = 'court_appearance',
  FILING = 'filing',
  RESPONSE = 'response',
  APPEAL = 'appeal',
  CLIENT_MEETING = 'client_meeting',
  INTERNAL_DEADLINE = 'internal_deadline',
  OTHER = 'other',
}

export enum DeadlinePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  type: DeadlineType;
  priority: DeadlinePriority;
  matterId: string;
  assignedToId: string;
  firmId: string;
  completed: boolean;
  completedAt?: Date;
  completedById?: string;
  ruleUsed?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeadlineCreateDto {
  title: string;
  description?: string;
  dueDate: Date;
  type: DeadlineType;
  priority?: DeadlinePriority;
  matterId: string;
  assignedToId: string;
  firmId: string;
  ruleUsed?: string;
}

export interface DeadlineUpdateDto {
  title?: string;
  description?: string;
  dueDate?: Date;
  type?: DeadlineType;
  priority?: DeadlinePriority;
  matterId?: string;
  assignedToId?: string;
  completed?: boolean;
  completedAt?: Date;
  completedById?: string;
  reminderSent?: boolean;
}

export interface DeadlineRule {
  id: string;
  name: string;
  description: string;
  triggerType: string;
  daysOffset: number;
  courtId?: string;
  jurisdictionId?: string;
  caseType?: string;
  createdAt: Date;
  updatedAt: Date;
}

