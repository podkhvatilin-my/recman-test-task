import { describe, it, expect, vi, beforeEach } from "vitest";
import { BoardStore } from "../BoardStore";
import type { Board } from "../../../model/board";
import type { IBoardRepository } from "../../../interface/IBoardRepository";

function createMockRepo(initial: Board): IBoardRepository {
  return {
    load: vi.fn(() => initial),
    save: vi.fn(),
  } as unknown as IBoardRepository;
}

const emptyBoard: Board = { tasks: {}, columns: [] };

describe("BoardStore", () => {
  let repo: IBoardRepository;
  let store: BoardStore;

  beforeEach(() => {
    repo = createMockRepo(emptyBoard);
    store = new BoardStore(repo);
  });

  it("loads board from repository on construction", () => {
    expect(repo.load).toHaveBeenCalledOnce();
    expect(store.getBoard()).toEqual(emptyBoard);
  });

  it("returns current board via getBoard()", () => {
    expect(store.getBoard()).toBe(store.getBoard());
  });

  describe("set", () => {
    it("updates board and persists to repository", () => {
      const next: Board = {
        tasks: {},
        columns: [{ id: "c1", title: "New", taskIds: [] }],
      };

      store.set(next);

      expect(store.getBoard()).toBe(next);
      expect(repo.save).toHaveBeenCalledWith(next);
    });

    it("notifies all subscribers", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      store.subscribe(listener1);
      store.subscribe(listener2);

      store.set(emptyBoard);

      expect(listener1).toHaveBeenCalledOnce();
      expect(listener2).toHaveBeenCalledOnce();
    });
  });

  describe("subscribe", () => {
    it("returns an unsubscribe function", () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      store.set(emptyBoard);

      expect(listener).not.toHaveBeenCalled();
    });

    it("does not notify removed listeners", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const unsub1 = store.subscribe(listener1);
      store.subscribe(listener2);

      unsub1();
      store.set(emptyBoard);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledOnce();
    });
  });
});
