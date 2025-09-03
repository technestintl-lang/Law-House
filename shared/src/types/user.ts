export enum UserRole {
  ADMIN = 'admin',
  LAWYER = 'lawyer',
  PARALEGAL = 'paralegal',
  STAFF = 'staff',
  CLIENT = 'client',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  firmId?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  firmId?: string;
}

export interface UserUpdateDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  firmId?: string;
  isActive?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: User;
}

