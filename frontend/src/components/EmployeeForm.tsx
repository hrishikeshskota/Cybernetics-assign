import { FormEvent, useState } from 'react';
import type { EmployeeInput } from '../types/employee';
import { DEPARTMENTS } from '../types/employee';

interface EmployeeFormProps {
  initial: EmployeeInput;
  saving: boolean;
  submitLabel: string;
  onSubmit: (input: EmployeeInput) => void;
  onCancel: () => void;
}

export function EmployeeForm({
  initial,
  saving,
  submitLabel,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeInput>(initial);

  const update = (field: keyof EmployeeInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__grid">
        <label className="field">
          <span>First Name</span>
          <input
            required
            value={form.firstName}
            onChange={(event) => update('firstName', event.target.value)}
            placeholder="Hrihsikesh"
          />
        </label>

        <label className="field">
          <span>Last Name</span>
          <input
            required
            value={form.lastName}
            onChange={(event) => update('lastName', event.target.value)}
            placeholder="Kota"
          />
        </label>

        <label className="field field--wide">
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder="jane.doe@company.com"
          />
        </label>

        <label className="field">
          <span>Department</span>
          <select
            required
            value={form.department}
            onChange={(event) => update('department', event.target.value)}
          >
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Role</span>
          <input
            required
            value={form.role}
            onChange={(event) => update('role', event.target.value)}
            placeholder="Software Engineer"
          />
        </label>

        <label className="field">
          <span>Hire Date</span>
          <input
            required
            type="date"
            value={form.hireDate}
            onChange={(event) => update('hireDate', event.target.value)}
          />
        </label>
      </div>

      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
