import { type ReactNode, useCallback, useMemo, useState } from "react";
import { SelectionContext } from "./context";

export function SelectionContextProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((taskId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((taskIds: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of taskIds) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (taskId: string) => selectedIds.has(taskId),
    [selectedIds],
  );

  const value = useMemo(
    () => ({
      selectedIds,
      toggle,
      selectAll,
      clear,
      isSelected,
      count: selectedIds.size,
    }),
    [selectedIds, toggle, selectAll, clear, isSelected],
  );

  return (
    <SelectionContext value={value}>
      {children}
    </SelectionContext>
  );
}
