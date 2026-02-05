import { type IBoardStore } from "../../interface/IBoardStore";
import {
  type FilterValue,
  IFilterService,
} from "../../interface/IFilterService";

export class FilterService extends IFilterService {
  private readonly boardStore: IBoardStore;

  constructor(boardStore: IBoardStore) {
    super();

    this.boardStore = boardStore;
  }

  override filter(taskIds: string[], status: FilterValue): string[] {
    if (status === "all") return taskIds;

    const board = this.boardStore.getBoard();

    return taskIds.filter((taskId) => {
      const task = board.tasks[taskId];
      return task?.status === status;
    });
  }
}
