import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  createPopulatedBoard,
  createMockTaskService,
} from "../../../test/test-utils";
import { BulkActionBar } from "../BulkActionBar";
import { TaskStatus } from "../../../model/task";

describe("BulkActionBar", () => {
  const board = createPopulatedBoard([
    {
      id: "col-1",
      title: "To Do",
      tasks: [
        { id: "t1", text: "Task 1" },
        { id: "t2", text: "Task 2" },
      ],
    },
    {
      id: "col-2",
      title: "Done",
      tasks: [],
    },
  ]);

  const selectedIds = new Set(["t1", "t2"]);

  it("shows the count of selected tasks", () => {
    renderWithProviders(<BulkActionBar />, {
      board,
      selectedIds,
      count: 2,
    });
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("Delete calls bulkDelete and clear", async () => {
    const taskService = createMockTaskService();
    const clear = vi.fn();
    const { user } = renderWithProviders(<BulkActionBar />, {
      board,
      taskService,
      selectedIds,
      count: 2,
      clear,
    });

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(taskService.bulkDelete).toHaveBeenCalledWith(["t1", "t2"]);
    expect(clear).toHaveBeenCalled();
  });

  it("Complete calls bulkSetStatus(COMPLETED) and clear", async () => {
    const taskService = createMockTaskService();
    const clear = vi.fn();
    const { user } = renderWithProviders(<BulkActionBar />, {
      board,
      taskService,
      selectedIds,
      count: 2,
      clear,
    });

    await user.click(screen.getByRole("button", { name: "Complete" }));
    expect(taskService.bulkSetStatus).toHaveBeenCalledWith(
      ["t1", "t2"],
      TaskStatus.COMPLETED,
    );
    expect(clear).toHaveBeenCalled();
  });

  it("Mark Active calls bulkSetStatus(ACTIVE) and clear", async () => {
    const taskService = createMockTaskService();
    const clear = vi.fn();
    const { user } = renderWithProviders(<BulkActionBar />, {
      board,
      taskService,
      selectedIds,
      count: 2,
      clear,
    });

    await user.click(screen.getByRole("button", { name: "Mark Active" }));
    expect(taskService.bulkSetStatus).toHaveBeenCalledWith(
      ["t1", "t2"],
      TaskStatus.ACTIVE,
    );
    expect(clear).toHaveBeenCalled();
  });

  it("Clear calls clear", async () => {
    const clear = vi.fn();
    const { user } = renderWithProviders(<BulkActionBar />, {
      board,
      selectedIds,
      count: 2,
      clear,
    });

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(clear).toHaveBeenCalled();
  });

  it("Move to... opens dialog and submitting calls bulkMove", async () => {
    const taskService = createMockTaskService();
    const clear = vi.fn();
    const { user } = renderWithProviders(<BulkActionBar />, {
      board,
      taskService,
      selectedIds,
      count: 2,
      clear,
    });

    await user.click(screen.getByRole("button", { name: "Move to..." }));
    expect(screen.getByText("Move to Column")).toBeInTheDocument();

    // Select a column in the dialog
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "col-2");
    await user.click(screen.getByRole("button", { name: "Move" }));

    expect(taskService.bulkMove).toHaveBeenCalledWith(["t1", "t2"], "col-2");
    expect(clear).toHaveBeenCalled();
  });
});
