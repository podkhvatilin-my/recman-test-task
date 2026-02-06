import { describe, it, expect, vi, beforeEach } from "vitest";
import { FilterService } from "../FilterService";
import { TaskStatus } from "../../../model/task";
import type { Board } from "../../../model/board";
import type { IBoardStore } from "../../../interface/IBoardStore";

function createMockStore(board: Board): IBoardStore {
  return {
    getBoard: () => board,
    set: vi.fn(),
    subscribe: vi.fn(() => () => {}),
  } as unknown as IBoardStore;
}

describe("FilterService", () => {
  let store: IBoardStore;
  let service: FilterService;

  const board: Board = {
    tasks: {
      "t-1": {
        id: "t-1",
        text: "active task",
        status: TaskStatus.ACTIVE,
        createdAt: 1,
      },
      "t-2": {
        id: "t-2",
        text: "completed task",
        status: TaskStatus.COMPLETED,
        createdAt: 2,
      },
      "t-3": {
        id: "t-3",
        text: "another active",
        status: TaskStatus.ACTIVE,
        createdAt: 3,
      },
    },
    columns: [
      { id: "col-1", title: "Col", taskIds: ["t-1", "t-2", "t-3"] },
    ],
  };

  const allIds = ["t-1", "t-2", "t-3"];

  beforeEach(() => {
    store = createMockStore(board);
    service = new FilterService(store);
  });

  it('returns all task ids when status is "all"', () => {
    expect(service.filter(allIds, "all")).toEqual(allIds);
  });

  it("returns only active tasks", () => {
    expect(service.filter(allIds, TaskStatus.ACTIVE)).toEqual(["t-1", "t-3"]);
  });

  it("returns only completed tasks", () => {
    expect(service.filter(allIds, TaskStatus.COMPLETED)).toEqual(["t-2"]);
  });

  it("only filters within provided task ids", () => {
    expect(service.filter(["t-2", "t-3"], TaskStatus.ACTIVE)).toEqual([
      "t-3",
    ]);
  });

  it("filters out task ids not in the board", () => {
    expect(service.filter(["nonexistent"], TaskStatus.ACTIVE)).toEqual([]);
  });
});
