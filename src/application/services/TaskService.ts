import { type IBoardStore } from "../../interface/IBoardStore";
import { ITaskService } from "../../interface/ITaskService";
import { TaskStatus, type Task } from "../../model/task";

export class TaskService extends ITaskService {
  private readonly boardStore: IBoardStore;

  constructor(boardStore: IBoardStore) {
    super();

    this.boardStore = boardStore;
  }

  override addTask(columnId: string, text: string): void {
    const board = structuredClone(this.boardStore.getBoard());
    const column = board.columns.find((c) => c.id === columnId);

    if (!column)
      throw new Error(`ColumnNotFoundError: Column not found: ${columnId}`);

    const task: Task = {
      id: crypto.randomUUID(),
      text,
      status: TaskStatus.ACTIVE,
      createdAt: Date.now(),
    };
    board.tasks[task.id] = task;

    column.taskIds.push(task.id);
    this.boardStore.set(board);
  }

  override removeTask(taskId: string): void {
    const board = structuredClone(this.boardStore.getBoard());

    if (!board.tasks[taskId])
      throw new Error(`TaskNotFoundError: Task not found: ${taskId}`);

    delete board.tasks[taskId];

    for (const col of board.columns) {
      col.taskIds = col.taskIds.filter((id) => id !== taskId);
    }

    this.boardStore.set(board);
  }

  override updateTask(taskId: string, text: string): void {
    const board = structuredClone(this.boardStore.getBoard());
    const task = board.tasks[taskId];

    if (!task) throw new Error(`TaskNotFoundError: Task not found: ${taskId}`);

    task.text = text;

    this.boardStore.set(board);
  }

  override toggleStatus(taskId: string): void {
    const board = structuredClone(this.boardStore.getBoard());
    const task = board.tasks[taskId];

    if (!task) throw new Error(`TaskNotFoundError: Task not found: ${taskId}`);

    task.status =
      task.status === TaskStatus.ACTIVE
        ? TaskStatus.COMPLETED
        : TaskStatus.ACTIVE;

    this.boardStore.set(board);
  }

  override moveTask(taskId: string, toColumnId: string, index?: number): void {
    const board = structuredClone(this.boardStore.getBoard());

    if (!board.tasks[taskId])
      throw new Error(`TaskNotFoundError: Task not found: ${taskId}`);

    // Remove from current column
    for (const col of board.columns) {
      const idx = col.taskIds.indexOf(taskId);

      if (idx !== -1) {
        col.taskIds.splice(idx, 1);
        break;
      }
    }

    // Add to target column
    const targetCol = board.columns.find((c) => c.id === toColumnId);

    if (!targetCol)
      throw new Error(`ColumnNotFoundError: Column not found: ${toColumnId}`);

    if (index !== undefined && index >= 0) {
      targetCol.taskIds.splice(index, 0, taskId);
    } else {
      targetCol.taskIds.push(taskId);
    }

    this.boardStore.set(board);
  }

  override bulkDelete(taskIds: string[]): void {
    const board = structuredClone(this.boardStore.getBoard());
    const idSet = new Set(taskIds);

    for (const id of taskIds) {
      delete board.tasks[id];
    }

    for (const col of board.columns) {
      col.taskIds = col.taskIds.filter((id) => !idSet.has(id));
    }

    this.boardStore.set(board);
  }

  override bulkSetStatus(taskIds: string[], status: TaskStatus): void {
    const board = structuredClone(this.boardStore.getBoard());

    for (const id of taskIds) {
      if (board.tasks[id]) {
        board.tasks[id].status = status;
      }
    }

    this.boardStore.set(board);
  }

  override bulkMove(taskIds: string[], toColumnId: string): void {
    const board = structuredClone(this.boardStore.getBoard());
    const targetCol = board.columns.find((c) => c.id === toColumnId);

    if (!targetCol)
      throw new Error(`ColumnNotFoundError: Column not found: ${toColumnId}`);

    const idSet = new Set(taskIds);

    // Remove from all columns
    for (const col of board.columns) {
      col.taskIds = col.taskIds.filter((id) => !idSet.has(id));
    }

    // Add to target
    targetCol.taskIds.push(...taskIds);

    this.boardStore.set(board);
  }
}
