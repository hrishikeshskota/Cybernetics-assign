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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmployeeInput(input: Partial<EmployeeInput>): string | null {
  const required: (keyof EmployeeInput)[] = [
    'firstName',
    'lastName',
    'email',
    'department',
    'role',
    'hireDate',
  ];

  for (const field of required) {
    const value = input[field];
    if (!value || typeof value !== 'string' || !value.trim()) {
      return `${field} is required`;
    }
  }

  if (!EMAIL_REGEX.test(input.email!.trim())) {
    return 'Invalid email address';
  }

  if (Number.isNaN(Date.parse(input.hireDate!))) {
    return 'Invalid hire date';
  }

  return null;
}

export function normalizeInput(input: EmployeeInput): EmployeeInput {
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    department: input.department.trim(),
    role: input.role.trim(),
    hireDate: input.hireDate.trim(),
  };
}
