import { createContext, useContext } from "react";

interface ISelectionContextValue {
  selectedIds: Set<string>;
  toggle: (taskId: string) => void;
  selectAll: (taskIds: string[]) => void;
  clear: () => void;
  isSelected: (taskId: string) => boolean;
  count: number;
}

export const SelectionContext = createContext<ISelectionContextValue | null>(null);

export function useSelectionContext(): ISelectionContextValue {
  const ctx = useContext(SelectionContext);

  if (!ctx)
    throw new Error("useSelectionContext must be used within SelectionProvider");

  return ctx;
}
