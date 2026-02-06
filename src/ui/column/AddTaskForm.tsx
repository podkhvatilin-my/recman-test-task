import { type SubmitEvent, useState } from "react";
import { useBoardContext } from "../../application/context/BoardContext";
import styles from "./Column.module.css";

interface AddTaskFormProps {
  columnId: string;
}

export function AddTaskForm({ columnId }: AddTaskFormProps) {
  const { taskService } = useBoardContext();

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = text.trim();

    if (trimmed) {
      taskService.addTask(columnId, trimmed);
      setText("");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className={styles.addBtn}>
        + Add a card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.addForm}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a title for this card..."
        required
        minLength={1}
        autoFocus
        className={styles.addTextarea}
      />
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitBtn}>
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setText("");
          }}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
