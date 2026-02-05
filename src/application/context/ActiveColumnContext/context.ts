import { createContext, useContext } from "react";

interface IActiveColumnContextValue {
  activeColumnId: string | undefined;
  setActiveColumnId: (id: string) => void;
}

export const ActiveColumnContext = createContext<IActiveColumnContextValue | null>(null);

export function useActiveColumnContext(): IActiveColumnContextValue {
  const ctx = useContext(ActiveColumnContext);

  if (!ctx)
    throw new Error(
      "useActiveColumnContext must be used within ActiveColumnProvider",
    );

  return ctx;
}
