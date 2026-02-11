import type { Board } from "../model/board";

export interface IBoardRepository {
  load(): Board;
  save(board: Board): void;
}
