import type { TaskStatus } from "../model/task";

export interface ITaskService {
  addTask(columnId: string, text: string): void;
  removeTask(taskId: string): void;
  updateTask(taskId: string, text: string): void;
  toggleStatus(taskId: string): void;
  moveTask(taskId: string, toColumnId: string, index?: number): void;
  bulkDelete(taskIds: string[]): void;
  bulkSetStatus(taskIds: string[], status: TaskStatus): void;
  bulkMove(taskIds: string[], toColumnId: string): void;
}
