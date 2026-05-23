import { useState } from 'react';
import ui from '../styles/ui.module.css';
import type { JournalFilters as Filters } from '../types';
import { isValidDateRange } from '../utils';
import styles from './JournalFilters.module.css';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function JournalFiltersBar({ filters, onChange }: Props) {
  const [inputsKey, setInputsKey] = useState(0);
  const rangeError =
    filters.dateFrom &&
    filters.dateTo &&
    !isValidDateRange(filters.dateFrom, filters.dateTo)
      ? 'Дата «С» не может быть позже даты «По»'
      : null;

  const handleReset = () => {
    onChange({ dateFrom: '', dateTo: '', sort: 'desc' });
    setInputsKey((key) => key + 1);
  };

  return (
    <div className={ui.card}>
      <h2 className={ui.cardTitle}>Фильтры</h2>
      {rangeError && <p className={styles.rangeError}>{rangeError}</p>}
      <div className={styles.row}>
        <label className={styles.fieldGroup}>
          С
          <input
            key={`dateFrom-${inputsKey}`}
            type="date"
            className={ui.field}
            value={filters.dateFrom}
            onChange={(e) =>
              onChange({ ...filters, dateFrom: e.target.value })
            }
          />
        </label>
        <label className={styles.fieldGroup}>
          По
          <input
            key={`dateTo-${inputsKey}`}
            type="date"
            className={ui.field}
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
          />
        </label>
        <label className={styles.fieldGroup}>
          Сортировка по дате
          <select
            className={ui.field}
            value={filters.sort}
            onChange={(e) =>
              onChange({
                ...filters,
                sort: e.target.value as 'asc' | 'desc',
              })
            }
          >
            <option value="desc">Сначала новые</option>
            <option value="asc">Сначала старые</option>
          </select>
        </label>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabelHidden} aria-hidden="true">
            Сброс
          </span>
          <button type="button" className={ui.btn} onClick={handleReset}>
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
