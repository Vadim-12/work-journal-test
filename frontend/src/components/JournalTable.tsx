import ui from '../styles/ui.module.css';
import type { JournalEntry } from '../types';
import { formatDate, formatVolume } from '../utils';
import styles from './JournalTable.module.css';

interface Props {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export function JournalTable({
  entries,
  onEdit,
  onDelete,
  deletingId,
}: Props) {
  if (entries.length === 0) {
    return (
      <div className={`${ui.card} ${ui.empty}`}>
        <p>Записей пока нет. Добавьте первую запись в журнал.</p>
      </div>
    );
  }

  return (
    <div className={`${ui.card} ${styles.wrap}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Вид работ</th>
            <th>Объём</th>
            <th>Исполнитель</th>
            <th className={styles.actionsCell} aria-label="Действия" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isDeleting = deletingId === entry.id;
            return (
              <tr
                key={entry.id}
                className={isDeleting ? styles.rowBusy : undefined}
              >
                <td>{formatDate(entry.performedAt)}</td>
                <td>{entry.workType.name}</td>
                <td>{formatVolume(entry.volume, entry.workType.unit)}</td>
                <td>{entry.executorName}</td>
                <td className={styles.actionsCell}>
                  <div className={styles.actions}>
                  <button
                    type="button"
                    className={ui.btnSmall}
                    onClick={() => onEdit(entry)}
                    disabled={isDeleting}
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    className={`${ui.btnSmall} ${ui.btnDanger}`}
                    disabled={isDeleting}
                    onClick={() => {
                      if (window.confirm('Удалить эту запись из журнала?')) {
                        onDelete(entry.id);
                      }
                    }}
                  >
                    {isDeleting ? 'Удаление…' : 'Удалить'}
                  </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
