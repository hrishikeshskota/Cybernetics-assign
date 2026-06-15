import type { Employee, EmployeeInput } from '../types/employee';

const API_URL = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Request failed');
  }

  return data as T;
}

export async function fetchEmployees(): Promise<Employee[]> {
  const data = await request<{ employees: Employee[] }>('/employees');
  return data.employees;
}

export async function createEmployee(input: EmployeeInput): Promise<Employee> {
  const data = await request<{ employee: Employee }>('/employees', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.employee;
}

export async function updateEmployee(id: string, input: EmployeeInput): Promise<Employee> {
  const data = await request<{ employee: Employee }>(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return data.employee;
}

export async function deleteEmployee(id: string): Promise<void> {
  await request<void>(`/employees/${id}`, { method: 'DELETE' });
}
