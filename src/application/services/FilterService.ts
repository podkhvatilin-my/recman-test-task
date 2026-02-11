import type { IBoardStore } from "../../interface/IBoardStore";
import type {
  FilterValue,
  IFilterService,
} from "../../interface/IFilterService";

export class FilterService implements IFilterService {
  private readonly boardStore: IBoardStore;

  constructor(boardStore: IBoardStore) {
    this.boardStore = boardStore;
  }

  filter(taskIds: string[], status: FilterValue): string[] {
    if (status === "all") return taskIds;

    const board = this.boardStore.getBoard();

    return taskIds.filter((taskId) => {
      const task = board.tasks[taskId];
      return task?.status === status;
    });
  }
}
