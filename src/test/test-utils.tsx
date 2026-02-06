import { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardContext } from "../application/context/BoardContext/context";
import { SearchContext } from "../application/context/SearchContext/context";
import { FilterContext } from "../application/context/FilterContext/context";
import { SelectionContext } from "../application/context/SelectionContext/context";
import { ActiveColumnContext } from "../application/context/ActiveColumnContext/context";
import type { Board } from "../model/board";
import type { Column } from "../model/column";
import { TaskStatus } from "../model/task";

// --- Factories ---

interface ColumnInput {
  id: string;
  title: string;
  tasks?: { id: string; text: string; status?: TaskStatus }[];
}

export function createPopulatedBoard(columns: ColumnInput[]): Board {
  const board: Board = { tasks: {}, columns: [] };

  for (const col of columns) {
    const taskIds: string[] = [];
    for (const t of col.tasks ?? []) {
      board.tasks[t.id] = {
        id: t.id,
        text: t.text,
        status: t.status ?? TaskStatus.ACTIVE,
        createdAt: Date.now(),
      };
      taskIds.push(t.id);
    }
    board.columns.push({ id: col.id, title: col.title, taskIds });
  }

  return board;
}

export function createMockTaskService() {
  return {
    addTask: vi.fn(),
    removeTask: vi.fn(),
    updateTask: vi.fn(),
    toggleStatus: vi.fn(),
    moveTask: vi.fn(),
    bulkDelete: vi.fn(),
    bulkSetStatus: vi.fn(),
    bulkMove: vi.fn(),
  };
}

export function createMockColumnService() {
  return {
    addColumn: vi.fn(),
    removeColumn: vi.fn(),
    renameColumn: vi.fn(),
    moveColumn: vi.fn(),
  };
}

export function createMockSearchService() {
  return {
    search: vi.fn((taskIds: string[]) => taskIds),
  };
}

export function createMockFilterService() {
  return {
    filter: vi.fn((taskIds: string[]) => taskIds),
  };
}

// --- renderWithProviders ---

interface ProviderOverrides {
  board?: Board;
  taskService?: ReturnType<typeof createMockTaskService>;
  columnService?: ReturnType<typeof createMockColumnService>;
  searchService?: ReturnType<typeof createMockSearchService>;
  filterService?: ReturnType<typeof createMockFilterService>;
  searchQuery?: string;
  searchDeferredQuery?: string;
  setQuery?: (q: string) => void;
  isPending?: boolean;
  filter?: "all" | "active" | "completed";
  setFilter?: (f: "all" | "active" | "completed") => void;
  selectedIds?: Set<string>;
  toggle?: (id: string) => void;
  selectAll?: (ids: string[]) => void;
  clear?: () => void;
  isSelected?: (id: string) => boolean;
  count?: number;
  activeColumnId?: string;
  setActiveColumnId?: (id: string) => void;
}

const emptyBoard: Board = { tasks: {}, columns: [] };

export function renderWithProviders(
  ui: ReactElement,
  options?: ProviderOverrides & { renderOptions?: RenderOptions },
) {
  const taskService = options?.taskService ?? createMockTaskService();
  const columnService = options?.columnService ?? createMockColumnService();
  const searchService = options?.searchService ?? createMockSearchService();
  const filterService = options?.filterService ?? createMockFilterService();
  const board = options?.board ?? emptyBoard;

  const boardCtx = {
    board,
    taskService: taskService as any,
    columnService: columnService as any,
    searchService: searchService as any,
    filterService: filterService as any,
  };

  const selectedIds = options?.selectedIds ?? new Set<string>();
  const selectionCtx = {
    selectedIds,
    toggle: options?.toggle ?? vi.fn(),
    selectAll: options?.selectAll ?? vi.fn(),
    clear: options?.clear ?? vi.fn(),
    isSelected: options?.isSelected ?? ((id: string) => selectedIds.has(id)),
    count: options?.count ?? selectedIds.size,
  };

  const searchCtx = {
    query: options?.searchQuery ?? "",
    deferredQuery: options?.searchDeferredQuery ?? options?.searchQuery ?? "",
    setQuery: options?.setQuery ?? vi.fn(),
    isPending: options?.isPending ?? false,
  };

  const filterCtx = {
    filter: options?.filter ?? ("all" as const),
    setFilter: options?.setFilter ?? vi.fn(),
  };

  const activeColumnCtx = {
    activeColumnId: options?.activeColumnId ?? board.columns[0]?.id,
    setActiveColumnId: options?.setActiveColumnId ?? vi.fn(),
  };

  const user = userEvent.setup();

  const result = render(
    <BoardContext.Provider value={boardCtx}>
      <SearchContext.Provider value={searchCtx}>
        <FilterContext.Provider value={filterCtx}>
          <SelectionContext.Provider value={selectionCtx}>
            <ActiveColumnContext.Provider value={activeColumnCtx}>
              {ui}
            </ActiveColumnContext.Provider>
          </SelectionContext.Provider>
        </FilterContext.Provider>
      </SearchContext.Provider>
    </BoardContext.Provider>,
    options?.renderOptions,
  );

  return {
    ...result,
    user,
    boardCtx,
    selectionCtx,
    searchCtx,
    filterCtx,
    activeColumnCtx,
  };
}
