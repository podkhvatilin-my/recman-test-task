import { createContext, useContext } from "react";
import type { TaskStatus } from "../../../model/task";

export type FilterValue = TaskStatus | "all";

interface IFilterContextValue {
  filter: FilterValue;
  setFilter: (filter: FilterValue) => void;
}

export const FilterContext = createContext<IFilterContextValue | null>(null);

export function useFilterContext(): IFilterContextValue {
  const ctx = useContext(FilterContext);

  if (!ctx)
    throw new Error("useFilterContext must be used within FilterProvider");

  return ctx;
}
