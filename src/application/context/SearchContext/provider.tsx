import { type ReactNode, useDeferredValue, useState, useTransition } from "react";
import { SearchContext } from "./context";

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const setQuery = (value: string) => {
    startTransition(() => {
      setQueryState(value);
    });
  };

  return (
    <SearchContext value={{ query, deferredQuery, setQuery, isPending }}>
      {children}
    </SearchContext>
  );
}
