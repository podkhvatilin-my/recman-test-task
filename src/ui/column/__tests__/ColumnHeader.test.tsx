import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  createPopulatedBoard,
  createMockColumnService,
} from "../../../test/test-utils";
import { ColumnHeader } from "../ColumnHeader";

describe("ColumnHeader", () => {
  const board = createPopulatedBoard([
    {
      id: "col-1",
      title: "To Do",
      tasks: [
        { id: "t1", text: "Task 1" },
        { id: "t2", text: "Task 2" },
      ],
    },
  ]);

  it("renders the column title", () => {
    renderWithProviders(<ColumnHeader columnId="col-1" />, { board });
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("opens rename dialog and calls columnService.renameColumn", async () => {
    const columnService = createMockColumnService();
    const { user } = renderWithProviders(<ColumnHeader columnId="col-1" />, {
      board,
      columnService,
    });

    // Open the details menu
    await user.click(screen.getByText("⋯"));
    // Click Rename
    await user.click(screen.getByText("Rename"));

    // Dialog should open with pre-filled value
    const input = screen.getByPlaceholderText("Column name...");
    expect(input).toHaveValue("To Do");

    // Clear and type new name
    await user.clear(input);
    await user.type(input, "Done");
    await user.click(screen.getByText("Save"));

    expect(columnService.renameColumn).toHaveBeenCalledWith("col-1", "Done");
  });

  it("Select All calls selectAll with column taskIds", async () => {
    const selectAll = vi.fn();
    const { user } = renderWithProviders(<ColumnHeader columnId="col-1" />, {
      board,
      selectAll,
    });

    await user.click(screen.getByText("⋯"));
    await user.click(screen.getByText("Select All"));

    expect(selectAll).toHaveBeenCalledWith(["t1", "t2"]);
  });

  it("Delete calls columnService.removeColumn", async () => {
    const columnService = createMockColumnService();
    const { user } = renderWithProviders(<ColumnHeader columnId="col-1" />, {
      board,
      columnService,
    });

    await user.click(screen.getByText("⋯"));
    await user.click(screen.getByText("Delete Column"));

    expect(columnService.removeColumn).toHaveBeenCalledWith("col-1");
  });

  it("returns null when column is not found", () => {
    const { container } = renderWithProviders(
      <ColumnHeader columnId="nonexistent" />,
      { board },
    );
    expect(container.innerHTML).toBe("");
  });
});
