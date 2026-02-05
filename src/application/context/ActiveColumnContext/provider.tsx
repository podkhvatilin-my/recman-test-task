import { type ReactNode, useState } from "react";
import { useBoardContext } from "../BoardContext";
import { ActiveColumnContext } from "./context";

export function ActiveColumnContextProvider({ children }: { children: ReactNode }) {
  const { board } = useBoardContext();
  const [activeColumnId, setActiveColumnId] = useState<string | undefined>(
    board.columns[0]?.id,
  );

  const safeActiveColumnId =
    board.columns.find((c) => c.id === activeColumnId)?.id ??
    board.columns[0]?.id;

  return (
    <ActiveColumnContext value={{ activeColumnId: safeActiveColumnId, setActiveColumnId }}>
      {children}
    </ActiveColumnContext>
  );
}
