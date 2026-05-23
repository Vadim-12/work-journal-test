import { FormEvent, useEffect, useState } from 'react';
import type { JournalEntryPayload } from '../api/journal-api';
import ui from '../styles/ui.module.css';
import type { JournalEntry, JournalEntryFormData, WorkType } from '../types';
import { isNotFutureDate, todayIso } from '../utils';
import styles from './JournalEntryForm.module.css';

interface Props {
  workTypes: WorkType[];
  initial?: JournalEntry | null;
  onSubmit: (data: JournalEntryPayload) => Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
}

const emptyForm = (): JournalEntryFormData => ({
  performedAt: new Date().toISOString().slice(0, 10),
  workTypeId: '',
  volume: '',
  executorName: '',
});

export function JournalEntryForm({
  workTypes,
  initial,
  onSubmit,
  onCancel,
  disabled = false,
}: Props) {
  const [form, setForm] = useState<JournalEntryFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        performedAt: initial.performedAt,
        workTypeId: initial.workTypeId,
        volume: String(parseFloat(initial.volume)),
        executorName: initial.executorName,
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [initial]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.performedAt) next.performedAt = 'Укажите дату';
    else if (!isNotFutureDate(form.performedAt)) {
      next.performedAt = 'Дата не может быть в будущем';
    }
    if (!form.workTypeId) next.workTypeId = 'Выберите вид работ';
    const volume = parseFloat(form.volume);
    if (!form.volume || Number.isNaN(volume) || volume <= 0) {
      next.volume = 'Укажите положительный объём';
    }
    if (!form.executorName.trim()) {
      next.executorName = 'Укажите ФИО исполнителя';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        performedAt: form.performedAt,
        workTypeId: form.workTypeId as number,
        volume: parseFloat(form.volume),
        executorName: form.executorName.trim(),
      });
      if (!initial) setForm(emptyForm());
    } finally {
      setSubmitting(false);
    }
  };

  const selectedUnit =
    workTypes.find((w) => w.id === form.workTypeId)?.unit ?? '';

  return (
    <form className={`${ui.card} ${styles.form}`} onSubmit={handleSubmit}>
      <h2 className={ui.cardTitle}>
        {initial ? 'Редактирование записи' : 'Новая запись'}
      </h2>

      <label>
        Дата выполнения *
        <input
          type="date"
          className={ui.field}
          max={todayIso()}
          value={form.performedAt}
          onChange={(e) =>
            setForm((f) => ({ ...f, performedAt: e.target.value }))
          }
        />
        {errors.performedAt && (
          <span className={ui.fieldError}>{errors.performedAt}</span>
        )}
      </label>

      <label>
        Вид работ *
        <select
          className={ui.field}
          value={form.workTypeId}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              workTypeId: e.target.value ? Number(e.target.value) : '',
            }))
          }
        >
          <option value="">— выберите —</option>
          {workTypes.map((wt) => (
            <option key={wt.id} value={wt.id}>
              {wt.name} ({wt.unit})
            </option>
          ))}
        </select>
        {errors.workTypeId && (
          <span className={ui.fieldError}>{errors.workTypeId}</span>
        )}
      </label>

      <label>
        Объём {selectedUnit ? `(${selectedUnit})` : ''} *
        <input
          type="number"
          className={ui.field}
          min="0.001"
          step="0.001"
          value={form.volume}
          onChange={(e) => setForm((f) => ({ ...f, volume: e.target.value }))}
          placeholder="24"
        />
        {errors.volume && (
          <span className={ui.fieldError}>{errors.volume}</span>
        )}
      </label>

      <label>
        ФИО исполнителя *
        <input
          type="text"
          className={ui.field}
          value={form.executorName}
          onChange={(e) =>
            setForm((f) => ({ ...f, executorName: e.target.value }))
          }
          placeholder="Иванов И.И."
          maxLength={255}
        />
        {errors.executorName && (
          <span className={ui.fieldError}>{errors.executorName}</span>
        )}
      </label>

      <div className={styles.actions}>
        <button
          type="submit"
          className={ui.btnPrimary}
          disabled={submitting || disabled}
        >
          {submitting ? 'Сохранение…' : initial ? 'Сохранить' : 'Добавить'}
        </button>
        {onCancel && (
          <button type="button" className={ui.btn} onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
