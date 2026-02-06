import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useBoardContext } from "../../application/context/BoardContext";
import { useSelectionContext } from "../../application/context/SelectionContext";
import { ColumnNameDialog } from "./ColumnNameDialog";
import styles from "./Column.module.css";

interface ColumnHeaderProps {
  columnId: string;
  dragHandleRef?: RefObject<HTMLDivElement | null>;
}

export function ColumnHeader({ columnId, dragHandleRef }: ColumnHeaderProps) {
  const { board, columnService } = useBoardContext();
  const { selectAll } = useSelectionContext();

  const detailsRef = useRef<HTMLDetailsElement>(null);

  const [renameOpen, setRenameOpen] = useState(false);

  const column = board.columns.find((c) => c.id === columnId);

  const handleRename = () => {
    setRenameOpen(true);
    detailsRef.current?.removeAttribute("open");
  };

  const handleRenameSubmit = useCallback(
    (newTitle: string) => {
      if (!column) return;

      if (newTitle !== column?.title) {
        columnService.renameColumn(columnId, newTitle);
      }
    },
    [columnService, columnId, column],
  );

  const handleRenameClose = useCallback(() => {
    setRenameOpen(false);
  }, []);

  const handleSelectAll = () => {
    if (!column) return;

    selectAll(column.taskIds);
    detailsRef.current?.removeAttribute("open");
  };

  const handleDelete = () => {
    columnService.removeColumn(columnId);
    detailsRef.current?.removeAttribute("open");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const details = detailsRef.current;

      if (details?.open && !details.contains(e.target as Node)) {
        details.removeAttribute("open");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!column) return null;

  return (
    <>
      <header ref={dragHandleRef} className={styles.columnHeader}>
        <h2 className={styles.title}>{column.title}</h2>
        <details ref={detailsRef} className={styles.menu}>
          <summary className={styles.menuTrigger}>&#x22EF;</summary>
          <div className={styles.menuContent}>
            <button onClick={handleRename}>Rename</button>
            <button onClick={handleSelectAll}>Select All</button>
            <button onClick={handleDelete} className={styles.danger}>
              Delete Column
            </button>
          </div>
        </details>
      </header>
      {renameOpen && (
        <ColumnNameDialog
          open={renameOpen}
          onClose={handleRenameClose}
          onSubmit={handleRenameSubmit}
          title="Rename Column"
          defaultValue={column.title}
        />
      )}
    </>
  );
}
