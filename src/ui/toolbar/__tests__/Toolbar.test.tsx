import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  createPopulatedBoard,
  createMockColumnService,
} from "../../../test/test-utils";
import { Toolbar } from "../Toolbar";

describe("Toolbar", () => {
  const board = createPopulatedBoard([
    { id: "col-1", title: "To Do", tasks: [] },
    { id: "col-2", title: "Done", tasks: [] },
  ]);

  it("renders search input", () => {
    renderWithProviders(<Toolbar />, { board });
    expect(
      screen.getByRole("searchbox", { name: /search tasks/i }),
    ).toBeInTheDocument();
  });

  it("typing in search calls setQuery", async () => {
    const setQuery = vi.fn();
    const { user } = renderWithProviders(<Toolbar />, {
      board,
      setQuery,
    });

    const input = screen.getByRole("searchbox", { name: /search tasks/i });
    await user.type(input, "hello");

    expect(setQuery).toHaveBeenCalled();
    // setQuery is called for each keystroke
    expect(setQuery).toHaveBeenCalledTimes(5);
  });

  it("renders filter radio buttons", () => {
    renderWithProviders(<Toolbar />, { board });
    expect(screen.getByRole("radio", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Active" })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Completed" }),
    ).toBeInTheDocument();
  });

  it("clicking filter calls setFilter", async () => {
    const setFilter = vi.fn();
    const { user } = renderWithProviders(<Toolbar />, {
      board,
      setFilter,
    });

    await user.click(screen.getByRole("radio", { name: "Active" }));
    expect(setFilter).toHaveBeenCalledWith("active");

    await user.click(screen.getByRole("radio", { name: "Completed" }));
    expect(setFilter).toHaveBeenCalledWith("completed");
  });

  it("Add Column opens dialog and submits", async () => {
    const columnService = createMockColumnService();
    const { user } = renderWithProviders(<Toolbar />, {
      board,
      columnService,
    });

    await user.click(screen.getByRole("button", { name: /add column/i }));
    expect(screen.getByText("Add Column", { selector: "h3" })).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Column name...");
    await user.type(input, "In Progress");
    await user.click(screen.getByText("Save"));

    expect(columnService.addColumn).toHaveBeenCalledWith("In Progress");
  });

  it("column switcher renders columns and calls setActiveColumnId", async () => {
    const setActiveColumnId = vi.fn();
    const { user } = renderWithProviders(<Toolbar />, {
      board,
      setActiveColumnId,
    });

    const select = screen.getByRole("combobox", { name: /select column/i });
    expect(select).toBeInTheDocument();

    await user.selectOptions(select, "col-2");
    expect(setActiveColumnId).toHaveBeenCalledWith("col-2");
  });
});
