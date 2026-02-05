import { useCallback, useEffect, useRef, useState } from "react";
import { useBoard } from "../../application/hooks/useBoard";
import { useSelection } from "../../application/hooks/useSelection";
import { ColumnNameDialog } from "./ColumnNameDialog";
import styles from "./Column.module.css";

interface ColumnHeaderProps {
  columnId: string;
}

export function ColumnHeader({ columnId }: ColumnHeaderProps) {
  const { board, columnService } = useBoard();
  const { selectAll } = useSelection();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [renameOpen, setRenameOpen] = useState(false);

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

  const column = board.columns.find((c) => c.id === columnId);
  if (!column) return null;

  const handleRename = () => {
    setRenameOpen(true);
    detailsRef.current?.removeAttribute("open");
  };

  const handleRenameSubmit = useCallback(
    (newTitle: string) => {
      if (newTitle !== column.title) {
        columnService.renameColumn(columnId, newTitle);
      }
    },
    [columnService, columnId, column.title],
  );

  const handleRenameClose = useCallback(() => {
    setRenameOpen(false);
  }, []);

  const handleSelectAll = () => {
    selectAll(column.taskIds);
    detailsRef.current?.removeAttribute("open");
  };

  const handleDelete = () => {
    columnService.removeColumn(columnId);
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <>
      <header className={styles.columnHeader}>
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
