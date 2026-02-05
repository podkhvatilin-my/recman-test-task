import { createContext, useContext } from "react";

interface ISearchContextValue {
  query: string;
  deferredQuery: string;
  setQuery: (query: string) => void;
  isPending: boolean;
}

export const SearchContext = createContext<ISearchContextValue | null>(null);

export function useSearchContext(): ISearchContextValue {
  const ctx = useContext(SearchContext);

  if (!ctx)
    throw new Error("useSearchContext must be used within SearchProvider");

  return ctx;
}
