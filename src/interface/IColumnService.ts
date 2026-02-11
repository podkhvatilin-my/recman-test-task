export interface IColumnService {
  addColumn(title: string): void;
  removeColumn(columnId: string): void;
  renameColumn(columnId: string, title: string): void;
  moveColumn(columnId: string, toIndex: number): void;
}
