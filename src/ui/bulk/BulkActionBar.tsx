import { type SubmitEvent, useRef, useState } from "react";
import { useBoardContext } from "../../application/context/BoardContext";
import { useSelectionContext } from "../../application/context/SelectionContext";
import { TaskStatus } from "../../model/task";
import styles from "./BulkActionBar.module.css";

export function BulkActionBar() {
  const { board, taskService } = useBoardContext();
  const { selectedIds, clear, count } = useSelectionContext();

  const moveDialogRef = useRef<HTMLDialogElement>(null);

  const [targetColumnId, setTargetColumnId] = useState("");

  const ids = Array.from(selectedIds);

  const handleDelete = () => {
    taskService.bulkDelete(ids);
    clear();
  };

  const handleComplete = () => {
    taskService.bulkSetStatus(ids, TaskStatus.COMPLETED);
    clear();
  };

  const handleMarkActive = () => {
    taskService.bulkSetStatus(ids, TaskStatus.ACTIVE);
    clear();
  };

  const handleMove = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (targetColumnId) {
      taskService.bulkMove(ids, targetColumnId);
      clear();
      moveDialogRef.current?.close();
      setTargetColumnId("");
    }
  };

  return (
    <>
      <div className={styles.bulkBar}>
        <span className={styles.count}>{count} selected</span>
        <button onClick={handleDelete} className={styles.deleteBtn}>
          Delete
        </button>
        <button onClick={handleComplete}>Complete</button>
        <button onClick={handleMarkActive}>Mark Active</button>
        <button onClick={() => moveDialogRef.current?.showModal()}>
          Move to...
        </button>
        <button onClick={clear}>Clear</button>
      </div>

      <dialog ref={moveDialogRef} className={styles.moveDialog}>
        <form onSubmit={handleMove}>
          <h3 className={styles.moveDialogTitle}>Move to Column</h3>
          <select
            required
            value={targetColumnId}
            onChange={(e) => setTargetColumnId(e.target.value)}
            className={styles.moveSelect}
          >
            <option value="">Select...</option>
            {board.columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
          <div className={styles.moveActions}>
            <button type="submit" className={styles.moveSubmitBtn}>
              Move
            </button>
            <button
              type="button"
              onClick={() => moveDialogRef.current?.close()}
              className={styles.moveCancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
