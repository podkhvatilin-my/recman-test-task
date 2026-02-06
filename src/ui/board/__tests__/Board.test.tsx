import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  createPopulatedBoard,
} from "../../../test/test-utils";
import { Board } from "../Board";

vi.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  draggable: vi.fn(() => vi.fn()),
  dropTargetForElements: vi.fn(() => vi.fn()),
}));

describe("Board", () => {
  it("renders a Column for each board column (non-virtual path)", () => {
    const board = createPopulatedBoard([
      { id: "col-1", title: "To Do", tasks: [{ id: "t1", text: "Task 1" }] },
      {
        id: "col-2",
        title: "In Progress",
        tasks: [{ id: "t2", text: "Task 2" }],
      },
      { id: "col-3", title: "Done", tasks: [{ id: "t3", text: "Task 3" }] },
    ]);

    renderWithProviders(<Board />, { board });

    // First column appears in both desktop and mobile views
    expect(screen.getAllByText("To Do").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("In Progress").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Done").length).toBeGreaterThanOrEqual(1);
  });

  it("renders tasks within columns", () => {
    const board = createPopulatedBoard([
      { id: "col-1", title: "To Do", tasks: [{ id: "t1", text: "Buy milk" }] },
      { id: "col-2", title: "Done", tasks: [{ id: "t2", text: "Clean room" }] },
    ]);

    renderWithProviders(<Board />, { board });

    // First column's task appears in desktop + mobile
    expect(screen.getAllByText("Buy milk").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Clean room").length).toBeGreaterThanOrEqual(1);
  });

  it("renders mobile column when activeColumnId is set", () => {
    const board = createPopulatedBoard([
      { id: "col-1", title: "To Do", tasks: [{ id: "t1", text: "Task A" }] },
      { id: "col-2", title: "Done", tasks: [{ id: "t2", text: "Task B" }] },
    ]);

    renderWithProviders(<Board />, {
      board,
      activeColumnId: "col-2",
    });

    // "Done" appears in desktop view + mobile view (activeColumnId=col-2)
    const doneHeaders = screen.getAllByText("Done");
    expect(doneHeaders.length).toBe(2);
  });

  it("renders empty board without errors", () => {
    const board = createPopulatedBoard([]);

    const { container } = renderWithProviders(<Board />, { board });
    expect(container).toBeInTheDocument();
  });

  it("renders all columns when under virtual threshold (<=10)", () => {
    const columns = Array.from({ length: 10 }, (_, i) => ({
      id: `col-${i}`,
      title: `Column ${i}`,
      tasks: [{ id: `t-${i}`, text: `Task ${i}` }],
    }));
    const board = createPopulatedBoard(columns);

    renderWithProviders(<Board />, { board });

    // All column titles should be present (some may appear twice due to mobile view)
    for (let i = 0; i < 10; i++) {
      expect(screen.getAllByText(`Column ${i}`).length).toBeGreaterThanOrEqual(
        1,
      );
    }
  });
});
