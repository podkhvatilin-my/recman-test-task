import { type ReactNode, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { BoardRepository } from "../../../infrastructure/persistence/BoardRepository";
import { setupDnDMonitor } from "../../../infrastructure/dnd";
import { TaskService } from "../../services/TaskService";
import { ColumnService } from "../../services/ColumnService";
import { BoardStore } from "../../store/BoardStore";
import { BoardContext } from "./context";

export function BoardContextProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new BoardStore(new BoardRepository()));

  const board = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getBoard.bind(store),
  );
  const taskService = useMemo(() => new TaskService(store), [store]);
  const columnService = useMemo(() => new ColumnService(store), [store]);

  useEffect(() => {
    return setupDnDMonitor(taskService, columnService);
  }, [taskService, columnService]);

  return (
    <BoardContext
      value={{
        board,
        taskService,
        columnService,
      }}
    >
      {children}
    </BoardContext>
  );
}
