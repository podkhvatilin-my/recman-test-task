import type { TaskStatus } from "../model/task";

export abstract class ITaskService {
  abstract addTask(columnId: string, text: string): void;
  abstract removeTask(taskId: string): void;
  abstract updateTask(taskId: string, text: string): void;
  abstract toggleStatus(taskId: string): void;
  abstract moveTask(taskId: string, toColumnId: string, index?: number): void;
  abstract bulkDelete(taskIds: string[]): void;
  abstract bulkSetStatus(taskIds: string[], status: TaskStatus): void;
  abstract bulkMove(taskIds: string[], toColumnId: string): void;
}
