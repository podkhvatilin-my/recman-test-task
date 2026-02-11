import type { TaskStatus } from "../model/task";

export type FilterValue = TaskStatus | "all";

export interface IFilterService {
  filter(taskIds: string[], status: FilterValue): string[];
}
