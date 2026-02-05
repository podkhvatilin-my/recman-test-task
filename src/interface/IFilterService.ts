import type { TaskStatus } from "../model/task";

export type FilterValue = TaskStatus | "all";

export abstract class IFilterService {
  abstract filter(taskIds: string[], status: FilterValue): string[];
}
