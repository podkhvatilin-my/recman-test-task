import { type IBoardStore } from "../../interface/IBoardStore";
import { ISearchService } from "../../interface/ISearchService";

export class SearchService extends ISearchService {
  private readonly boardStore: IBoardStore;

  constructor(boardStore: IBoardStore) {
    super();

    this.boardStore = boardStore;
  }

  override search(taskIds: string[], query: string): string[] {
    const trimmed = query.trim();

    if (!trimmed) return taskIds;

    const board = this.boardStore.getBoard();
    const lowerQuery = trimmed.toLowerCase();

    return taskIds.filter((taskId) => {
      const task = board.tasks[taskId];
      return task?.text.toLowerCase().includes(lowerQuery);
    });
  }
}
