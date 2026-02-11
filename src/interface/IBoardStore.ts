import type { Board } from "../model/board";

export interface Listener {
  (): void;
}

export interface IBoardStore {
  getBoard(): Board;
  set(next: Board): void;
  subscribe(cb: Listener): () => void;
}
