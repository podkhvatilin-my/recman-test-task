export abstract class ISearchService {
  abstract search(taskIds: string[], query: string): string[];
}
