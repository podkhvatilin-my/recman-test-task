import { useCallback, useState } from "react";
import { useBoardContext } from "../../application/context/BoardContext";
import { useSearchContext } from "../../application/context/SearchContext";
import { useFilterContext } from "../../application/context/FilterContext";
import { useActiveColumnContext } from "../../application/context/ActiveColumnContext";
import type { FilterValue } from "../../application/context/FilterContext";
import { ColumnNameDialog } from "../column/ColumnNameDialog";
import styles from "./Toolbar.module.css";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function Toolbar() {
  const { board, columnService } = useBoardContext();
  const { query, setQuery } = useSearchContext();
  const { filter, setFilter } = useFilterContext();
  const { activeColumnId, setActiveColumnId } = useActiveColumnContext();

  const [addColumnOpen, setAddColumnOpen] = useState(false);

  const handleAddColumnSubmit = useCallback(
    (title: string) => {
      columnService.addColumn(title);
    },
    [columnService],
  );

  const handleAddColumnClose = useCallback(() => {
    setAddColumnOpen(false);
  }, []);

  return (
    <>
      <div className={styles.toolbar}>
        <input
          type="search"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search tasks"
        />

        <fieldset className={styles.filterGroup}>
          <legend
            className="sr-only"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
            }}
          >
            Filter tasks
          </legend>
          {FILTERS.map((f) => (
            <label
              key={f.value}
              className={`${styles.filterLabel} ${filter === f.value ? styles.active : ""}`}
            >
              <input
                type="radio"
                name="filter"
                value={f.value}
                checked={filter === f.value}
                onChange={() => setFilter(f.value)}
                className={styles.filterRadio}
              />
              {f.label}
            </label>
          ))}
        </fieldset>

        <button
          onClick={() => setAddColumnOpen(true)}
          className={styles.addColumnBtn}
        >
          + Add Column
        </button>

        <select
          value={activeColumnId ?? ""}
          onChange={(e) => setActiveColumnId(e.target.value)}
          className={styles.columnSwitcher}
          aria-label="Select column"
        >
          {board.columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>
      </div>
      {addColumnOpen && (
        <ColumnNameDialog
          open={addColumnOpen}
          onClose={handleAddColumnClose}
          onSubmit={handleAddColumnSubmit}
          title="Add Column"
        />
      )}
    </>
  );
}
