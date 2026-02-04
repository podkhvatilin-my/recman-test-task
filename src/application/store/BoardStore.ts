import { type Board } from "../../model/board";
import { type IBoardRepository } from "../../interface/IBoardRepository";
import { type Listener, IBoardStore } from "../../interface/IBoardStore";

export class BoardStore extends IBoardStore {
  private readonly boardRepository: IBoardRepository;

  private board: Board;
  private listeners = new Set<Listener>();

  constructor(boardRepository: IBoardRepository) {
    super();

    this.boardRepository = boardRepository;
    this.board = boardRepository.load();
  }

  getBoard(): Board {
    return this.board;
  }

  set(next: Board): void {
    this.board = next;

    this.boardRepository.save(next);
    this.listeners.forEach((fn) => fn());
  }

  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);

    return () => this.listeners.delete(cb);
  }
}
