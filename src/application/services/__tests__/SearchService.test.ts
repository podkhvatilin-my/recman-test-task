import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchService } from "../SearchService";
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

describe("SearchService", () => {
  let store: IBoardStore;
  let service: SearchService;

  const board: Board = {
    tasks: {
      "t-1": {
        id: "t-1",
        text: "Buy groceries",
        status: TaskStatus.ACTIVE,
        createdAt: 1,
      },
      "t-2": {
        id: "t-2",
        text: "Fix login bug",
        status: TaskStatus.ACTIVE,
        createdAt: 2,
      },
      "t-3": {
        id: "t-3",
        text: "Deploy to production",
        status: TaskStatus.COMPLETED,
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
    service = new SearchService(store);
  });

  it("returns all task ids when query is empty", () => {
    expect(service.search(allIds, "")).toEqual(allIds);
  });

  it("returns all task ids when query is whitespace only", () => {
    expect(service.search(allIds, "   ")).toEqual(allIds);
  });

  it("filters by case-insensitive substring match", () => {
    expect(service.search(allIds, "bug")).toEqual(["t-2"]);
  });

  it("matches regardless of case", () => {
    expect(service.search(allIds, "BUY")).toEqual(["t-1"]);
  });

  it("matches partial text", () => {
    expect(service.search(allIds, "prod")).toEqual(["t-3"]);
  });

  it("returns empty array when nothing matches", () => {
    expect(service.search(allIds, "zzzzz")).toEqual([]);
  });

  it("only searches within provided task ids", () => {
    expect(service.search(["t-1"], "bug")).toEqual([]);
  });

  it("filters out task ids that are not in the board", () => {
    expect(service.search(["t-1", "nonexistent"], "groceries")).toEqual([
      "t-1",
    ]);
  });
});
