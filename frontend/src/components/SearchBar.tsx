interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search">
      <span className="search__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        className="search__input"
        placeholder="Search by name, email, department, or role..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search employees"
      />
    </label>
  );
}
