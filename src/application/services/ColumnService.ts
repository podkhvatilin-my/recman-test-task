import type { IColumnService } from "../../interface/IColumnService";
import type { IBoardStore } from "../../interface/IBoardStore";

export class ColumnService implements IColumnService {
  private readonly boardStore: IBoardStore;

  constructor(boardStore: IBoardStore) {
    this.boardStore = boardStore;
  }

  addColumn(title: string): void {
    const board = structuredClone(this.boardStore.getBoard());

    board.columns.push({
      id: crypto.randomUUID(),
      title,
      taskIds: [],
    });

    this.boardStore.set(board);
  }

  removeColumn(columnId: string): void {
    const board = structuredClone(this.boardStore.getBoard());
    const colIndex = board.columns.findIndex((c) => c.id === columnId);

    if (colIndex === -1)
      throw new Error(`ColumnNotFoundError: Column not found: ${columnId}`);

    const column = board.columns[colIndex];

    for (const taskId of column.taskIds) {
      delete board.tasks[taskId];
    }

    board.columns.splice(colIndex, 1);
    this.boardStore.set(board);
  }

  renameColumn(columnId: string, title: string): void {
    const board = structuredClone(this.boardStore.getBoard());
    const column = board.columns.find((c) => c.id === columnId);

    if (!column)
      throw new Error(`ColumnNotFoundError: Column not found: ${columnId}`);

    column.title = title;

    this.boardStore.set(board);
  }

  moveColumn(columnId: string, toIndex: number): void {
    const board = structuredClone(this.boardStore.getBoard());
    const fromIndex = board.columns.findIndex((c) => c.id === columnId);

    if (fromIndex === -1)
      throw new Error(`ColumnNotFoundError: Column not found: ${columnId}`);

    const [column] = board.columns.splice(fromIndex, 1);

    board.columns.splice(toIndex, 0, column);
    this.boardStore.set(board);
  }
}
