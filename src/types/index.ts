export type Priority = 'urgent' | 'high' | 'normal' | 'low';

export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed';

export type UserRole = 'admin' | 'head' | 'staff';

export interface Department {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  role: UserRole;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  assignedTo: string; // Name or email
  assignedBy: string; // Name or email of supervisor
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  notes?: string; // Submissions, update logs, or link to work
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfigStatus {
  isConfigured: boolean;
  sheetId?: string;
  clientEmail?: string;
  errorMessage?: string;
}
