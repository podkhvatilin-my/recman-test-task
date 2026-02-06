import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  createPopulatedBoard,
  createMockSearchService,
  createMockFilterService,
} from "../../../test/test-utils";
import { Column } from "../Column";
import { TaskStatus } from "../../../model/task";

vi.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  draggable: vi.fn(() => vi.fn()),
  dropTargetForElements: vi.fn(() => vi.fn()),
}));

describe("Column", () => {
  const board = createPopulatedBoard([
    {
      id: "col-1",
      title: "To Do",
      tasks: [
        { id: "t1", text: "Task 1", status: TaskStatus.ACTIVE },
        { id: "t2", text: "Task 2", status: TaskStatus.COMPLETED },
        { id: "t3", text: "Task 3", status: TaskStatus.ACTIVE },
      ],
    },
  ]);

  it("renders the ColumnHeader with title", () => {
    renderWithProviders(<Column columnId="col-1" columnIndex={0} />, {
      board,
    });
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("renders TaskCards for visible tasks", () => {
    renderWithProviders(<Column columnId="col-1" columnIndex={0} />, {
      board,
    });
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("renders AddTaskForm", () => {
    renderWithProviders(<Column columnId="col-1" columnIndex={0} />, {
      board,
    });
    expect(
      screen.getByRole("button", { name: /add a card/i }),
    ).toBeInTheDocument();
  });

  it("returns null when column is not found", () => {
    const { container } = renderWithProviders(
      <Column columnId="nonexistent" columnIndex={0} />,
      { board },
    );
    expect(container.innerHTML).toBe("");
  });

  it("applies filter to task IDs", () => {
    const filterService = createMockFilterService();
    // Filter returns only t1 and t3
    filterService.filter.mockImplementation(() => ["t1", "t3"]);

    renderWithProviders(<Column columnId="col-1" columnIndex={0} />, {
      board,
      filterService,
    });

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("applies search to task IDs", () => {
    const searchService = createMockSearchService();
    // Search returns only t2
    searchService.search.mockImplementation(() => ["t2"]);

    renderWithProviders(<Column columnId="col-1" columnIndex={0} />, {
      board,
      searchService,
      searchDeferredQuery: "Task 2",
    });

    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.queryByText("Task 3")).not.toBeInTheDocument();
  });

  it("applies filter then search in sequence", () => {
    const filterService = createMockFilterService();
    const searchService = createMockSearchService();
    // Filter returns t1 and t3, then search narrows to t1
    filterService.filter.mockImplementation(() => ["t1", "t3"]);
    searchService.search.mockImplementation(() => ["t1"]);

    renderWithProviders(<Column columnId="col-1" columnIndex={0} />, {
      board,
      filterService,
      searchService,
    });

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Task 3")).not.toBeInTheDocument();

    // Verify filter is called first with all taskIds, then search with filtered result
    expect(filterService.filter).toHaveBeenCalledWith(
      ["t1", "t2", "t3"],
      "all",
    );
    expect(searchService.search).toHaveBeenCalledWith(["t1", "t3"], "");
  });
});
