import { createContext, useContext } from "react";
import { type Board } from "../../../model/board";
import { type TaskService } from "../../services/TaskService";
import { type ColumnService } from "../../services/ColumnService";

interface IBoardContextValue {
  board: Board;
  taskService: TaskService;
  columnService: ColumnService;
}

export const BoardContext = createContext<IBoardContextValue | null>(null);

export function useBoardContext(): IBoardContextValue {
  const ctx = useContext(BoardContext);

  if (!ctx)
    throw new Error("useBoardContext must be used within BoardProvider");

  return ctx;
}
