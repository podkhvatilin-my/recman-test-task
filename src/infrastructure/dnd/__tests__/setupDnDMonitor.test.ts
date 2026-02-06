import { describe, it, expect, vi, beforeEach } from "vitest";
import { DnDItemType } from "../DnDItemType";

type OnDropFn = (args: { source: { data: Record<string, unknown> }; location: { current: { dropTargets: Array<{ data: Record<string, unknown> }> } } }) => void;

vi.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  monitorForElements: vi.fn((opts) => {
    // Store the onDrop handler so tests can invoke it
    (monitorForElements as any).__onDrop = opts.onDrop;
    return vi.fn(); // cleanup function
  }),
}));

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setupDnDMonitor } from "../setupDnDMonitor";
import type { TaskService } from "../../../application/services/TaskService";
import type { ColumnService } from "../../../application/services/ColumnService";

function getOnDrop(): OnDropFn {
  return (monitorForElements as any).__onDrop;
}

describe("setupDnDMonitor", () => {
  let taskService: TaskService;
  let columnService: ColumnService;

  beforeEach(() => {
    vi.clearAllMocks();
    taskService = { moveTask: vi.fn() } as unknown as TaskService;
    columnService = { moveColumn: vi.fn() } as unknown as ColumnService;
    setupDnDMonitor(taskService, columnService);
  });

  it("calls monitorForElements on setup", () => {
    expect(monitorForElements).toHaveBeenCalled();
  });

  it("moves a task on drop", () => {
    const onDrop = getOnDrop();

    onDrop({
      source: { data: { type: DnDItemType.TASK, taskId: "t-1" } },
      location: {
        current: {
          dropTargets: [{ data: { columnId: "col-2", index: 1 } }],
        },
      },
    });

    expect(taskService.moveTask).toHaveBeenCalledWith("t-1", "col-2", 1);
  });

  it("moves a column on drop", () => {
    const onDrop = getOnDrop();

    onDrop({
      source: { data: { type: DnDItemType.COLUMN, columnId: "col-1" } },
      location: {
        current: {
          dropTargets: [{ data: { columnIndex: 2 } }],
        },
      },
    });

    expect(columnService.moveColumn).toHaveBeenCalledWith("col-1", 2);
  });

  it("does nothing when there are no drop targets", () => {
    const onDrop = getOnDrop();

    onDrop({
      source: { data: { type: DnDItemType.TASK, taskId: "t-1" } },
      location: { current: { dropTargets: [] } },
    });

    expect(taskService.moveTask).not.toHaveBeenCalled();
  });

  it("does not move task when toColumnId is falsy", () => {
    const onDrop = getOnDrop();

    onDrop({
      source: { data: { type: DnDItemType.TASK, taskId: "t-1" } },
      location: {
        current: {
          dropTargets: [{ data: { columnId: "", index: 0 } }],
        },
      },
    });

    expect(taskService.moveTask).not.toHaveBeenCalled();
  });

  it("does not move column when toIndex is not a number", () => {
    const onDrop = getOnDrop();

    onDrop({
      source: { data: { type: DnDItemType.COLUMN, columnId: "col-1" } },
      location: {
        current: {
          dropTargets: [{ data: { columnIndex: undefined } }],
        },
      },
    });

    expect(columnService.moveColumn).not.toHaveBeenCalled();
  });
});
