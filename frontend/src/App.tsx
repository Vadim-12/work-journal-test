import { useEffect, useRef, useState } from 'react';
import { getErrorMessage } from './api/client';
import type { JournalEntryPayload } from './api/journal-api';
import styles from './App.module.css';
import { JournalEntryForm } from './components/JournalEntryForm';
import { JournalFiltersBar } from './components/JournalFilters';
import { JournalTable } from './components/JournalTable';
import { ToastContainer } from './components/ToastContainer';
import { useJournalEntries } from './hooks/useJournalEntries';
import { useJournalEntryMutations } from './hooks/useJournalEntryMutations';
import { useToasts } from './hooks/useToasts';
import { useWorkTypes } from './hooks/useWorkTypes';
import ui from './styles/ui.module.css';
import type { JournalEntry, JournalFilters } from './types';
import { isValidDateRange } from './utils';

export default function App() {
  const [filters, setFilters] = useState<JournalFilters>({
    dateFrom: '',
    dateTo: '',
    sort: 'desc',
  });
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const { toasts, push: pushToast, dismiss } = useToasts();
  const lastErrorRef = useRef<string | null>(null);

  const filtersValid = isValidDateRange(filters.dateFrom, filters.dateTo);

  const workTypesQuery = useWorkTypes();
  const entriesQuery = useJournalEntries(filters, filtersValid);
  const { create, update, remove } = useJournalEntryMutations();

  const error =
    (workTypesQuery.error && getErrorMessage(workTypesQuery.error)) ||
    (entriesQuery.error && getErrorMessage(entriesQuery.error)) ||
    (create.error && getErrorMessage(create.error)) ||
    (update.error && getErrorMessage(update.error)) ||
    (remove.error && getErrorMessage(remove.error)) ||
    null;

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      pushToast('error', error);
      lastErrorRef.current = error;
    }
    if (!error) {
      lastErrorRef.current = null;
    }
  }, [error, pushToast]);

  const handleCreate = async (data: JournalEntryPayload) => {
    await create.mutateAsync(data);
    pushToast('success', 'Запись добавлена в журнал');
  };

  const handleUpdate = async (data: JournalEntryPayload) => {
    if (!editing) return;
    await update.mutateAsync({ id: editing.id, data });
    setEditing(null);
    pushToast('success', 'Запись обновлена');
  };

  const handleDelete = async (id: number) => {
    await remove.mutateAsync(id);
    if (editing?.id === id) setEditing(null);
    pushToast('success', 'Запись удалена');
  };

  const workTypes = workTypesQuery.data ?? [];
  const entries = entriesQuery.data ?? [];
  const loading = entriesQuery.isLoading;
  const deletingId = remove.isPending ? (remove.variables ?? null) : null;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Журнал работ</h1>
        <p className={styles.subtitle}>
          Учёт выполненных работ на строительном объекте
        </p>
      </header>

      <main className={styles.layout}>
        <aside>
          <JournalEntryForm
            workTypes={workTypes}
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={editing ? () => setEditing(null) : undefined}
            disabled={workTypesQuery.isLoading}
          />
        </aside>

        <section className={styles.content}>
          <JournalFiltersBar filters={filters} onChange={setFilters} />
          {!filtersValid ? (
            <div className={`${ui.card} ${ui.empty}`}>
              Исправьте диапазон дат в фильтрах
            </div>
          ) : loading ? (
            <div className={`${ui.card} ${ui.empty}`}>Загрузка…</div>
          ) : (
            <JournalTable
              entries={entries}
              onEdit={setEditing}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          )}
        </section>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
