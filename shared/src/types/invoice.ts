export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_MONEY = 'mobile_money',
  CREDIT_CARD = 'credit_card',
  OTHER = 'other',
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  matterId: string;
  firmId: string;
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  timeEntryIds: string[];
  paymentMethod?: PaymentMethod;
  paymentDate?: Date;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceCreateDto {
  clientId: string;
  matterId: string;
  firmId: string;
  issueDate?: Date;
  dueDate?: Date;
  notes?: string;
  timeEntryIds: string[];
}

export interface InvoiceUpdateDto {
  status?: InvoiceStatus;
  notes?: string;
  paymentMethod?: PaymentMethod;
  paymentDate?: Date;
  paymentReference?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  timeEntryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

