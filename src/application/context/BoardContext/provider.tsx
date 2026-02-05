import { type ReactNode, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { BoardRepository } from "../../../infrastructure/persistence/BoardRepository";
import { setupDnDMonitor } from "../../../infrastructure/dnd";
import { TaskService } from "../../services/TaskService";
import { ColumnService } from "../../services/ColumnService";
import { SearchService } from "../../services/SearchService";
import { FilterService } from "../../services/FilterService";
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
  const searchService = useMemo(() => new SearchService(store), [store]);
  const filterService = useMemo(() => new FilterService(store), [store]);

  useEffect(() => {
    return setupDnDMonitor(taskService, columnService);
  }, [taskService, columnService]);

  return (
    <BoardContext
      value={{
        board,
        taskService,
        columnService,
        searchService,
        filterService,
      }}
    >
      {children}
    </BoardContext>
  );
}
