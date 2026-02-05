import { type ReactNode, useState } from "react";
import { FilterContext, type FilterValue } from "./context";

export function FilterContextProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<FilterValue>("all");

  return (
    <FilterContext value={{ filter, setFilter }}>
      {children}
    </FilterContext>
  );
}
