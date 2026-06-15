import type { Employee } from '../types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function EmployeeTable({ employees, loading, onEdit, onDelete }: EmployeeTableProps) {
  if (loading) {
    return <div className="empty-state">Loading employees...</div>;
  }

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <strong>No employees found</strong>
        <p>Add your first team member to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Hire Date</th>
            <th aria-label="Actions"> </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="employee-name">
                  <span className="avatar" aria-hidden="true">
                    {employee.firstName[0]}
                    {employee.lastName[0]}
                  </span>
                  <span>
                    {employee.firstName} {employee.lastName}
                  </span>
                </div>
              </td>
              <td>{employee.email}</td>
              <td>
                <span className="badge">{employee.department}</span>
              </td>
              <td>{employee.role}</td>
              <td>{formatDate(employee.hireDate)}</td>
              <td>
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--small"
                    onClick={() => onDelete(employee)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
