import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from './api/employees';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeTable } from './components/EmployeeTable';
import { SearchBar } from './components/SearchBar';
import type { Employee, EmployeeInput } from './types/employee';
import { emptyEmployeeInput } from './types/employee';

type View = 'list' | 'create' | 'edit';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<View>('list');
  const [selected, setSelected] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeInput>(emptyEmployeeInput());

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;

    return employees.filter((employee) => {
      const haystack = [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.department,
        employee.role,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [employees, search]);

  const openCreate = () => {
    setFormData(emptyEmployeeInput());
    setSelected(null);
    setView('create');
    setError(null);
  };

  const openEdit = (employee: Employee) => {
    setSelected(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      hireDate: employee.hireDate.slice(0, 10),
    });
    setView('edit');
    setError(null);
  };

  const closeForm = () => {
    setView('list');
    setSelected(null);
    setError(null);
  };

  const handleSubmit = async (input: EmployeeInput) => {
    setSaving(true);
    setError(null);
    try {
      if (view === 'edit' && selected) {
        await updateEmployee(selected.id, input);
      } else {
        await createEmployee(input);
      }
      await loadEmployees();
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    const name = `${employee.firstName} ${employee.lastName}`;
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;

    setError(null);
    try {
      await deleteEmployee(employee.id);
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <div className="header__logo">EMS</div>
          <div>
            <h1>Employee Management</h1>
            <p>Manage your team with a fast, serverless stack on AWS.</p>
          </div>
        </div>
        {view === 'list' && (
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            Add Employee
          </button>
        )}
      </header>

      <main className="main">
        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        {view === 'list' ? (
          <>
            <section className="stats">
              <article className="stat-card">
                <span className="stat-card__label">Total Employees</span>
                <strong className="stat-card__value">{employees.length}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-card__label">Departments</span>
                <strong className="stat-card__value">
                  {new Set(employees.map((e) => e.department)).size}
                </strong>
              </article>
              <article className="stat-card">
                <span className="stat-card__label">Showing</span>
                <strong className="stat-card__value">{filtered.length}</strong>
              </article>
            </section>

            <section className="panel">
              <div className="panel__toolbar">
                <SearchBar value={search} onChange={setSearch} />
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => void loadEmployees()}
                  disabled={loading}
                >
                  Refresh
                </button>
              </div>

              <EmployeeTable
                employees={filtered}
                loading={loading}
                onEdit={openEdit}
                onDelete={(employee) => void handleDelete(employee)}
              />
            </section>
          </>
        ) : (
          <section className="panel panel--form">
            <div className="panel__header">
              <h2>{view === 'edit' ? 'Edit Employee' : 'New Employee'}</h2>
              <button type="button" className="btn btn--ghost" onClick={closeForm}>
                Back to list
              </button>
            </div>
            <EmployeeForm
              initial={formData}
              saving={saving}
              submitLabel={view === 'edit' ? 'Save Changes' : 'Create Employee'}
              onSubmit={(input) => void handleSubmit(input)}
              onCancel={closeForm}
            />
          </section>
        )}
      </main>

      <footer className="footer">
        <span>React + Vite frontend</span>
        <span>AWS Lambda · DynamoDB · S3 · CloudFront</span>
      </footer>
    </div>
  );
}
