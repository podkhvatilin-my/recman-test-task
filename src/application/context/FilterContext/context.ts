import { createContext, useContext } from "react";
import type { FilterValue } from "../../../interface/IFilterService";

export type { FilterValue };

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
