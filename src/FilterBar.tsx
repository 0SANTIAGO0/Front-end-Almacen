import { useState, useEffect } from "react";
import "./styles.css";

// Define los tipos de los props
interface FilterBarProps {
  filters: string[];
  onFilterChange: (values: Record<string, string>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    onFilterChange(values);
  }, [values, onFilterChange]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      {filters.map((filter) => (
        <div key={filter} className="input-container">
          <label htmlFor={filter} className="input-label">
            {filter}
          </label>
          <input
            id={filter}
            type="text"
            placeholder={`Filtrar por ${filter}`}
            value={values[filter] || ""}
            onChange={(e) => setValues({ ...values, [filter]: e.target.value })}
            className="input"
          />
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
