export interface ISearchService {
  search(taskIds: string[], query: string): string[];
}
