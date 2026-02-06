import { type SubmitEvent, useEffect, useRef, useState } from "react";
import { useBoardContext } from "../../application/context/BoardContext";
import { TaskStatus } from "../../model/task";
import styles from "./TaskCard.module.css";

interface TaskEditDialogProps {
  taskId: string;
  columnId: string;
  open: boolean;
  onClose: () => void;
}

export function TaskEditDialog({
  taskId,
  columnId,
  open,
  onClose,
}: TaskEditDialogProps) {
  const { board, taskService } = useBoardContext();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const task = board.tasks[taskId];

  const [text, setText] = useState(task?.text ?? "");
  const [status, setStatus] = useState<string>(
    task?.status ?? TaskStatus.ACTIVE,
  );
  const [moveTarget, setMoveTarget] = useState("");

  const handleSave = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = text.trim();

    if (trimmed) {
      taskService.updateTask(taskId, trimmed);
    }

    if (status !== task.status) {
      taskService.toggleStatus(taskId);
    }

    if (moveTarget && moveTarget !== columnId) {
      taskService.moveTask(taskId, moveTarget);
    }

    setMoveTarget("");
    onClose();
  };

  const handleDelete = () => {
    taskService.removeTask(taskId);
    onClose();
  };

  useEffect(() => {
    if (task) {
      setText(task.text);
      setStatus(task.status);
    }
  }, [task]);

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

  if (!task) return null;

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <form onSubmit={handleSave}>
        <h3 className={styles.dialogTitle}>Edit Task</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          minLength={1}
          className={styles.textarea}
        />
        <label className={styles.statusLabel}>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.statusSelect}
          >
            <option value={TaskStatus.ACTIVE}>Active</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </label>
        <label className={styles.moveLabel}>
          Move to
          <select
            value={moveTarget}
            onChange={(e) => setMoveTarget(e.target.value)}
            className={styles.moveSelect}
          >
            <option value="">Current column</option>
            {board.columns
              .filter((col) => col.id !== columnId)
              .map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
          </select>
        </label>
        <div className={styles.dialogActions}>
          <button type="submit" className={styles.saveBtn}>
            Save
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={styles.deleteBtn}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelDialogBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
