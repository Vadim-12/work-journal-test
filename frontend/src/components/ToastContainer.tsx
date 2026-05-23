import type { Toast } from '../hooks/useToasts';
import styles from './ToastContainer.module.css';

interface Props {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.viewport} aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${
            toast.type === 'success' ? styles.success : styles.error
          }`}
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          <p className={styles.message}>{toast.message}</p>
          <button
            type="button"
            className={styles.close}
            aria-label="Закрыть"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
