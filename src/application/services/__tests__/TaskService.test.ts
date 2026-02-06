import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskService } from "../TaskService";
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

function makeBoard(overrides?: Partial<Board>): Board {
  return {
    tasks: {},
    columns: [],
    ...overrides,
  };
}

describe("TaskService", () => {
  let store: IBoardStore;
  let service: TaskService;

  beforeEach(() => {
    store = createMockStore(
      makeBoard({
        columns: [
          { id: "col-1", title: "To Do", taskIds: [] },
          { id: "col-2", title: "Done", taskIds: [] },
        ],
      }),
    );
    service = new TaskService(store);
  });

  describe("addTask", () => {
    it("creates a task and adds it to the column", () => {
      service.addTask("col-1", "My task");

      const board = store.getBoard();
      const taskIds = board.columns[0].taskIds;
      expect(taskIds).toHaveLength(1);

      const task = board.tasks[taskIds[0]];
      expect(task.text).toBe("My task");
      expect(task.status).toBe(TaskStatus.ACTIVE);
      expect(task.createdAt).toBeTypeOf("number");
    });

    it("throws when column does not exist", () => {
      expect(() => service.addTask("no-col", "task")).toThrow(
        "ColumnNotFoundError",
      );
    });
  });

  describe("removeTask", () => {
    it("deletes task and removes id from columns", () => {
      service.addTask("col-1", "task");
      const taskId = store.getBoard().columns[0].taskIds[0];

      service.removeTask(taskId);

      const board = store.getBoard();
      expect(board.tasks[taskId]).toBeUndefined();
      expect(board.columns[0].taskIds).toHaveLength(0);
    });

    it("throws when task does not exist", () => {
      expect(() => service.removeTask("no-task")).toThrow("TaskNotFoundError");
    });
  });

  describe("updateTask", () => {
    it("updates the task text", () => {
      service.addTask("col-1", "old text");
      const taskId = store.getBoard().columns[0].taskIds[0];

      service.updateTask(taskId, "new text");

      expect(store.getBoard().tasks[taskId].text).toBe("new text");
    });

    it("throws when task does not exist", () => {
      expect(() => service.updateTask("no-task", "text")).toThrow(
        "TaskNotFoundError",
      );
    });
  });

  describe("toggleStatus", () => {
    it("toggles ACTIVE to COMPLETED", () => {
      service.addTask("col-1", "task");
      const taskId = store.getBoard().columns[0].taskIds[0];

      service.toggleStatus(taskId);

      expect(store.getBoard().tasks[taskId].status).toBe(
        TaskStatus.COMPLETED,
      );
    });

    it("toggles COMPLETED back to ACTIVE", () => {
      service.addTask("col-1", "task");
      const taskId = store.getBoard().columns[0].taskIds[0];

      service.toggleStatus(taskId);
      service.toggleStatus(taskId);

      expect(store.getBoard().tasks[taskId].status).toBe(TaskStatus.ACTIVE);
    });

    it("throws when task does not exist", () => {
      expect(() => service.toggleStatus("no-task")).toThrow(
        "TaskNotFoundError",
      );
    });
  });

  describe("moveTask", () => {
    it("moves a task to another column (appends)", () => {
      service.addTask("col-1", "task");
      const taskId = store.getBoard().columns[0].taskIds[0];

      service.moveTask(taskId, "col-2");

      const board = store.getBoard();
      expect(board.columns[0].taskIds).toHaveLength(0);
      expect(board.columns[1].taskIds).toEqual([taskId]);
    });

    it("moves a task to a specific index", () => {
      service.addTask("col-2", "existing");
      service.addTask("col-1", "mover");
      const moverId = store.getBoard().columns[0].taskIds[0];

      service.moveTask(moverId, "col-2", 0);

      expect(store.getBoard().columns[1].taskIds[0]).toBe(moverId);
    });

    it("throws when task does not exist", () => {
      expect(() => service.moveTask("no-task", "col-1")).toThrow(
        "TaskNotFoundError",
      );
    });

    it("throws when target column does not exist", () => {
      service.addTask("col-1", "task");
      const taskId = store.getBoard().columns[0].taskIds[0];

      expect(() => service.moveTask(taskId, "no-col")).toThrow(
        "ColumnNotFoundError",
      );
    });
  });

  describe("bulkDelete", () => {
    it("deletes multiple tasks at once", () => {
      service.addTask("col-1", "t1");
      service.addTask("col-1", "t2");
      service.addTask("col-1", "t3");
      const ids = store.getBoard().columns[0].taskIds.slice();

      service.bulkDelete([ids[0], ids[1]]);

      const board = store.getBoard();
      expect(board.columns[0].taskIds).toEqual([ids[2]]);
      expect(board.tasks[ids[0]]).toBeUndefined();
      expect(board.tasks[ids[1]]).toBeUndefined();
      expect(board.tasks[ids[2]]).toBeDefined();
    });
  });

  describe("bulkSetStatus", () => {
    it("sets status for multiple tasks", () => {
      service.addTask("col-1", "t1");
      service.addTask("col-1", "t2");
      const ids = store.getBoard().columns[0].taskIds.slice();

      service.bulkSetStatus(ids, TaskStatus.COMPLETED);

      const board = store.getBoard();
      expect(board.tasks[ids[0]].status).toBe(TaskStatus.COMPLETED);
      expect(board.tasks[ids[1]].status).toBe(TaskStatus.COMPLETED);
    });

    it("skips non-existent task ids without throwing", () => {
      service.addTask("col-1", "t1");
      const id = store.getBoard().columns[0].taskIds[0];

      expect(() =>
        service.bulkSetStatus([id, "ghost"], TaskStatus.COMPLETED),
      ).not.toThrow();
      expect(store.getBoard().tasks[id].status).toBe(TaskStatus.COMPLETED);
    });
  });

  describe("bulkMove", () => {
    it("moves multiple tasks to target column", () => {
      service.addTask("col-1", "t1");
      service.addTask("col-1", "t2");
      const ids = store.getBoard().columns[0].taskIds.slice();

      service.bulkMove(ids, "col-2");

      const board = store.getBoard();
      expect(board.columns[0].taskIds).toHaveLength(0);
      expect(board.columns[1].taskIds).toEqual(ids);
    });

    it("throws when target column does not exist", () => {
      service.addTask("col-1", "t1");
      const ids = store.getBoard().columns[0].taskIds.slice();

      expect(() => service.bulkMove(ids, "no-col")).toThrow(
        "ColumnNotFoundError",
      );
    });
  });

  describe("immutability", () => {
    it("does not mutate the original board", () => {
      const originalBoard = store.getBoard();

      service.addTask("col-1", "task");

      // The store mock replaces the board, but the original object should be untouched
      expect(originalBoard.columns[0].taskIds).toHaveLength(0);
      expect(Object.keys(originalBoard.tasks)).toHaveLength(0);
    });
  });
});
