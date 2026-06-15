export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  hireDate: string;
}

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
] as const;

export const emptyEmployeeInput = (): EmployeeInput => ({
  firstName: '',
  lastName: '',
  email: '',
  department: DEPARTMENTS[0],
  role: '',
  hireDate: new Date().toISOString().slice(0, 10),
});
