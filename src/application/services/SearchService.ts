import type { IBoardStore } from "../../interface/IBoardStore";
import type { ISearchService } from "../../interface/ISearchService";

export class SearchService implements ISearchService {
  private readonly boardStore: IBoardStore;

  constructor(boardStore: IBoardStore) {
    this.boardStore = boardStore;
  }

  search(taskIds: string[], query: string): string[] {
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
