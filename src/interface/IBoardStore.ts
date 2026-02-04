import { type Board } from "../model/board";

export interface Listener {
  (): void;
}

export abstract class IBoardStore {
  abstract getBoard(): Board;
  abstract set(next: Board): void;
  abstract subscribe(cb: Listener): () => void;
}
