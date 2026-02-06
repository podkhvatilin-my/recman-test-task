import { describe, it, expect, vi, beforeEach } from "vitest";
import { ColumnService } from "../ColumnService";
import { TaskStatus } from "../../../model/task";
import type { Board } from "../../../model/board";
import type { IBoardStore } from "../../../interface/IBoardStore";

function createMockStore(initial: Board): IBoardStore {
  let board = initial;
  return {
    getBoard: () => board,
    set: vi.fn((next: Board) => {
      board = next;
    }),
    subscribe: vi.fn(() => () => {}),
  } as unknown as IBoardStore;
}

describe("ColumnService", () => {
  let store: IBoardStore;
  let service: ColumnService;

  beforeEach(() => {
    store = createMockStore({ tasks: {}, columns: [] });
    service = new ColumnService(store);
  });

  describe("addColumn", () => {
    it("adds a new column with the given title", () => {
      service.addColumn("Backlog");

      const board = store.getBoard();
      expect(board.columns).toHaveLength(1);
      expect(board.columns[0].title).toBe("Backlog");
      expect(board.columns[0].taskIds).toEqual([]);
      expect(board.columns[0].id).toBeTypeOf("string");
    });

    it("appends columns in order", () => {
      service.addColumn("A");
      service.addColumn("B");

      const titles = store.getBoard().columns.map((c) => c.title);
      expect(titles).toEqual(["A", "B"]);
    });
  });

  describe("removeColumn", () => {
    it("removes the column and its tasks", () => {
      store = createMockStore({
        tasks: {
          "t-1": {
            id: "t-1",
            text: "task",
            status: TaskStatus.ACTIVE,
            createdAt: 1,
          },
          "t-2": {
            id: "t-2",
            text: "keep",
            status: TaskStatus.ACTIVE,
            createdAt: 2,
          },
        },
        columns: [
          { id: "col-1", title: "Remove Me", taskIds: ["t-1"] },
          { id: "col-2", title: "Keep", taskIds: ["t-2"] },
        ],
      });
      service = new ColumnService(store);

      service.removeColumn("col-1");

      const board = store.getBoard();
      expect(board.columns).toHaveLength(1);
      expect(board.columns[0].id).toBe("col-2");
      expect(board.tasks["t-1"]).toBeUndefined();
      expect(board.tasks["t-2"]).toBeDefined();
    });

    it("throws when column does not exist", () => {
      expect(() => service.removeColumn("no-col")).toThrow(
        "ColumnNotFoundError",
      );
    });
  });

  describe("renameColumn", () => {
    it("renames the column", () => {
      service.addColumn("Old Name");
      const colId = store.getBoard().columns[0].id;

      service.renameColumn(colId, "New Name");

      expect(store.getBoard().columns[0].title).toBe("New Name");
    });

    it("throws when column does not exist", () => {
      expect(() => service.renameColumn("no-col", "title")).toThrow(
        "ColumnNotFoundError",
      );
    });
  });

  describe("moveColumn", () => {
    it("reorders columns", () => {
      service.addColumn("A");
      service.addColumn("B");
      service.addColumn("C");
      const colId = store.getBoard().columns[2].id; // C

      service.moveColumn(colId, 0);

      const titles = store.getBoard().columns.map((c) => c.title);
      expect(titles).toEqual(["C", "A", "B"]);
    });

    it("throws when column does not exist", () => {
      expect(() => service.moveColumn("no-col", 0)).toThrow(
        "ColumnNotFoundError",
      );
    });
  });

  describe("immutability", () => {
    it("does not mutate the original board", () => {
      service.addColumn("First");
      const originalBoard = store.getBoard();
      const originalLen = originalBoard.columns.length;

      service.addColumn("Second");

      expect(originalBoard.columns).toHaveLength(originalLen);
    });
  });
});
