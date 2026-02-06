import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BoardRepository } from "../BoardRepository";
import type { Board } from "../../../model/board";
import { TaskStatus } from "../../../model/task";

const STORAGE_KEY = "recman-board";

const validBoard: Board = {
  tasks: {
    "t-1": {
      id: "t-1",
      text: "task",
      status: TaskStatus.ACTIVE,
      createdAt: 1,
    },
  },
  columns: [{ id: "col-1", title: "Col", taskIds: ["t-1"] }],
};

describe("BoardRepository", () => {
  let repo: BoardRepository;
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};

    const localStorageMock = {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete storage[key];
      }),
    };

    vi.stubGlobal("localStorage", localStorageMock);
    repo = new BoardRepository();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("load", () => {
    it("returns empty board when storage is empty", () => {
      const board = repo.load();

      expect(board).toEqual({ tasks: {}, columns: [] });
    });

    it("loads and parses valid board from storage", () => {
      storage[STORAGE_KEY] = JSON.stringify(validBoard);

      const board = repo.load();

      expect(board).toEqual(validBoard);
    });

    it("returns empty board when stored data is invalid JSON", () => {
      storage[STORAGE_KEY] = "not json{{{";

      const board = repo.load();

      expect(board).toEqual({ tasks: {}, columns: [] });
    });

    it("returns empty board when stored data fails validation", () => {
      storage[STORAGE_KEY] = JSON.stringify({ foo: "bar" });

      const board = repo.load();

      expect(board).toEqual({ tasks: {}, columns: [] });
    });

    it("returns empty board when tasks is not an object", () => {
      storage[STORAGE_KEY] = JSON.stringify({ tasks: "string", columns: [] });

      const board = repo.load();

      expect(board).toEqual({ tasks: {}, columns: [] });
    });

    it("returns empty board when columns is not an array", () => {
      storage[STORAGE_KEY] = JSON.stringify({ tasks: {}, columns: "string" });

      const board = repo.load();

      expect(board).toEqual({ tasks: {}, columns: [] });
    });
  });

  describe("save", () => {
    it("saves board to localStorage", () => {
      repo.save(validBoard);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(validBoard),
      );
    });

    it("does not throw when localStorage.setItem throws", () => {
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        throw new Error("QuotaExceeded");
      });

      expect(() => repo.save(validBoard)).not.toThrow();
    });
  });
});
