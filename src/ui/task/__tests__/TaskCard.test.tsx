import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  createPopulatedBoard,
  createMockTaskService,
} from "../../../test/test-utils";
import { TaskCard } from "../TaskCard";
import { TaskStatus } from "../../../model/task";

vi.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  draggable: vi.fn(() => vi.fn()),
  dropTargetForElements: vi.fn(() => vi.fn()),
}));

describe("TaskCard", () => {
  const board = createPopulatedBoard([
    {
      id: "col-1",
      title: "To Do",
      tasks: [
        { id: "t1", text: "Buy groceries", status: TaskStatus.ACTIVE },
        { id: "t2", text: "Clean house", status: TaskStatus.COMPLETED },
      ],
    },
  ]);

  it("renders task text", () => {
    renderWithProviders(
      <TaskCard taskId="t1" columnId="col-1" index={0} />,
      { board },
    );
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("renders status checkbox unchecked for active task", () => {
    renderWithProviders(
      <TaskCard taskId="t1" columnId="col-1" index={0} />,
      { board },
    );
    const checkbox = screen.getByRole("checkbox", {
      name: /mark "buy groceries" as completed/i,
    });
    expect(checkbox).not.toBeChecked();
  });

  it("renders status checkbox checked for completed task", () => {
    renderWithProviders(
      <TaskCard taskId="t2" columnId="col-1" index={1} />,
      { board },
    );
    const checkbox = screen.getByRole("checkbox", {
      name: /mark "clean house" as active/i,
    });
    expect(checkbox).toBeChecked();
  });

  it("toggle checkbox calls taskService.toggleStatus", async () => {
    const taskService = createMockTaskService();
    const { user } = renderWithProviders(
      <TaskCard taskId="t1" columnId="col-1" index={0} />,
      { board, taskService },
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /mark "buy groceries"/i,
    });
    await user.click(checkbox);
    expect(taskService.toggleStatus).toHaveBeenCalledWith("t1");
  });

  it("click opens edit dialog", async () => {
    const { user } = renderWithProviders(
      <TaskCard taskId="t1" columnId="col-1" index={0} />,
      { board },
    );

    // Click the card (not the checkbox)
    await user.click(screen.getByText("Buy groceries"));
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("bulk checkbox is visible when selection count > 0", () => {
    renderWithProviders(
      <TaskCard taskId="t1" columnId="col-1" index={0} />,
      {
        board,
        count: 2,
        selectedIds: new Set(["t2"]),
      },
    );
    const bulkCheckbox = screen.getByRole("checkbox", {
      name: /select "buy groceries" for bulk action/i,
    });
    expect(bulkCheckbox).toBeInTheDocument();
  });

  it("highlights search matches in task text", () => {
    const { container } = renderWithProviders(
      <TaskCard taskId="t1" columnId="col-1" index={0} />,
      { board, searchDeferredQuery: "groceries" },
    );
    const mark = container.querySelector("mark");
    expect(mark).not.toBeNull();
    expect(mark!.textContent).toBe("groceries");
  });

  it("returns null when task is not found", () => {
    const { container } = renderWithProviders(
      <TaskCard taskId="nonexistent" columnId="col-1" index={0} />,
      { board },
    );
    expect(container.innerHTML).toBe("");
  });
});
