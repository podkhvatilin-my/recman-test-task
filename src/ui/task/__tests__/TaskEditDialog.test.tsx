import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  createPopulatedBoard,
  createMockTaskService,
} from "../../../test/test-utils";
import { TaskEditDialog } from "../TaskEditDialog";
import { TaskStatus } from "../../../model/task";

describe("TaskEditDialog", () => {
  const board = createPopulatedBoard([
    {
      id: "col-1",
      title: "To Do",
      tasks: [{ id: "t1", text: "My Task", status: TaskStatus.ACTIVE }],
    },
    {
      id: "col-2",
      title: "Done",
      tasks: [],
    },
  ]);

  const defaultProps = {
    taskId: "t1",
    columnId: "col-1",
    open: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("pre-fills task text", () => {
    renderWithProviders(<TaskEditDialog {...defaultProps} />, { board });
    expect(screen.getByDisplayValue("My Task")).toBeInTheDocument();
  });

  it("pre-fills task status", () => {
    renderWithProviders(<TaskEditDialog {...defaultProps} />, { board });
    const statusSelect = screen.getByDisplayValue("Active");
    expect(statusSelect).toBeInTheDocument();
  });

  it("shows other columns in the move-to select", () => {
    renderWithProviders(<TaskEditDialog {...defaultProps} />, { board });
    // The move-to select should show "Current column" as default and "Done" as option
    expect(screen.getByText("Current column")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Done" })).toBeInTheDocument();
    // The current column should NOT appear in move options
    const moveSelect = screen.getByDisplayValue("Current column");
    const options = moveSelect.querySelectorAll("option");
    const optionTexts = Array.from(options).map((o) => o.textContent);
    expect(optionTexts).not.toContain("To Do");
  });

  it("Save calls updateTask when text changes", async () => {
    const taskService = createMockTaskService();
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <TaskEditDialog {...defaultProps} onClose={onClose} />,
      { board, taskService },
    );

    const textarea = screen.getByDisplayValue("My Task");
    await user.clear(textarea);
    await user.type(textarea, "Updated Task");
    await user.click(screen.getByText("Save"));

    expect(taskService.updateTask).toHaveBeenCalledWith("t1", "Updated Task");
    expect(onClose).toHaveBeenCalled();
  });

  it("Save calls toggleStatus when status changes", async () => {
    const taskService = createMockTaskService();
    const { user } = renderWithProviders(
      <TaskEditDialog {...defaultProps} />,
      { board, taskService },
    );

    await user.selectOptions(screen.getByDisplayValue("Active"), "completed");
    await user.click(screen.getByText("Save"));

    expect(taskService.toggleStatus).toHaveBeenCalledWith("t1");
  });

  it("Save calls moveTask when move target changes", async () => {
    const taskService = createMockTaskService();
    const { user } = renderWithProviders(
      <TaskEditDialog {...defaultProps} />,
      { board, taskService },
    );

    await user.selectOptions(
      screen.getByDisplayValue("Current column"),
      "col-2",
    );
    await user.click(screen.getByText("Save"));

    expect(taskService.moveTask).toHaveBeenCalledWith("t1", "col-2");
  });

  it("Delete calls removeTask and onClose", async () => {
    const taskService = createMockTaskService();
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <TaskEditDialog {...defaultProps} onClose={onClose} />,
      { board, taskService },
    );

    await user.click(screen.getByText("Delete"));

    expect(taskService.removeTask).toHaveBeenCalledWith("t1");
    expect(onClose).toHaveBeenCalled();
  });

  it("Cancel calls onClose", async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <TaskEditDialog {...defaultProps} onClose={onClose} />,
      { board },
    );

    await user.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("returns null when task is not found", () => {
    const { container } = renderWithProviders(
      <TaskEditDialog
        taskId="nonexistent"
        columnId="col-1"
        open={true}
        onClose={vi.fn()}
      />,
      { board },
    );
    expect(container.innerHTML).toBe("");
  });
});
