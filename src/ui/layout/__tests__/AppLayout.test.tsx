import { screen } from "@testing-library/react";
import { renderWithProviders, createPopulatedBoard } from "../../../test/test-utils";
import { AppLayout } from "../AppLayout";

vi.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  draggable: vi.fn(() => vi.fn()),
  dropTargetForElements: vi.fn(() => vi.fn()),
}));

vi.mock("../../toolbar/Toolbar", () => ({
  Toolbar: () => <div data-testid="toolbar">Toolbar</div>,
}));

vi.mock("../../board/Board", () => ({
  Board: () => <div data-testid="board">Board</div>,
}));

vi.mock("../../bulk/BulkActionBar", () => ({
  BulkActionBar: () => <div data-testid="bulk-action-bar">BulkActionBar</div>,
}));

describe("AppLayout", () => {
  const board = createPopulatedBoard([
    { id: "col-1", title: "To Do", tasks: [] },
  ]);

  it("renders Toolbar and Board", () => {
    renderWithProviders(<AppLayout />, { board, count: 0 });
    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("board")).toBeInTheDocument();
  });

  it("hides BulkActionBar when selection count is 0", () => {
    renderWithProviders(<AppLayout />, { board, count: 0 });
    expect(screen.queryByTestId("bulk-action-bar")).not.toBeInTheDocument();
  });

  it("shows BulkActionBar when selection count > 0", () => {
    renderWithProviders(<AppLayout />, {
      board,
      count: 3,
      selectedIds: new Set(["t1", "t2", "t3"]),
    });
    expect(screen.getByTestId("bulk-action-bar")).toBeInTheDocument();
  });
});
