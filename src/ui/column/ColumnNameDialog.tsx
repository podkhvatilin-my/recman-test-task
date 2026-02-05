import { type FormEvent, useEffect, useRef, useState } from "react";
import styles from "./Column.module.css";

interface ColumnNameDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  title: string;
  defaultValue?: string;
}

export function ColumnNameDialog({ open, onClose, onSubmit, title, defaultValue = "" }: ColumnNameDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState(defaultValue);

  useEffect(() => {
    setName(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
    onClose();
  };

  return (
    <dialog ref={dialogRef} className={styles.columnDialog}>
      <form onSubmit={handleSubmit}>
        <h3 className={styles.columnDialogTitle}>{title}</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={1}
          autoFocus
          className={styles.columnNameInput}
          placeholder="Column name..."
        />
        <div className={styles.columnDialogActions}>
          <button type="submit" className={styles.columnDialogSubmit}>
            Save
          </button>
          <button type="button" onClick={onClose} className={styles.columnDialogCancel}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
