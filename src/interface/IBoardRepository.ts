import { type Board } from "../model/board";

export abstract class IBoardRepository {
  abstract load(): Board;
  abstract save(board: Board): void;
}
