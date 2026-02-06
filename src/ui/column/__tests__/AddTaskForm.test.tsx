import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  createPopulatedBoard,
  createMockTaskService,
} from "../../../test/test-utils";
import { AddTaskForm } from "../AddTaskForm";

describe("AddTaskForm", () => {
  const board = createPopulatedBoard([
    { id: "col-1", title: "To Do", tasks: [] },
  ]);

  it("shows 'Add a card' button initially", () => {
    renderWithProviders(<AddTaskForm columnId="col-1" />, { board });
    expect(
      screen.getByRole("button", { name: /add a card/i }),
    ).toBeInTheDocument();
  });

  it("opens the form when button is clicked", async () => {
    const { user } = renderWithProviders(<AddTaskForm columnId="col-1" />, {
      board,
    });

    await user.click(screen.getByRole("button", { name: /add a card/i }));
    expect(
      screen.getByPlaceholderText("Enter a title for this card..."),
    ).toBeInTheDocument();
  });

  it("submits and calls taskService.addTask with trimmed text", async () => {
    const taskService = createMockTaskService();
    const { user } = renderWithProviders(<AddTaskForm columnId="col-1" />, {
      board,
      taskService,
    });

    await user.click(screen.getByRole("button", { name: /add a card/i }));

    const textarea = screen.getByPlaceholderText(
      "Enter a title for this card...",
    );
    await user.type(textarea, "  New Task  ");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(taskService.addTask).toHaveBeenCalledWith("col-1", "New Task");
  });

  it("Cancel closes the form", async () => {
    const { user } = renderWithProviders(<AddTaskForm columnId="col-1" />, {
      board,
    });

    await user.click(screen.getByRole("button", { name: /add a card/i }));
    expect(
      screen.getByPlaceholderText("Enter a title for this card..."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByPlaceholderText("Enter a title for this card..."),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add a card/i }),
    ).toBeInTheDocument();
  });

  it("does not submit when text is only whitespace", async () => {
    const taskService = createMockTaskService();
    const { user } = renderWithProviders(<AddTaskForm columnId="col-1" />, {
      board,
      taskService,
    });

    await user.click(screen.getByRole("button", { name: /add a card/i }));
    const textarea = screen.getByPlaceholderText(
      "Enter a title for this card...",
    );
    await user.type(textarea, "   ");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(taskService.addTask).not.toHaveBeenCalled();
  });
});
