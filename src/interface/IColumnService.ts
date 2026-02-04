export abstract class IColumnService {
  abstract addColumn(title: string): void;
  abstract removeColumn(columnId: string): void;
  abstract renameColumn(columnId: string, title: string): void;
  abstract moveColumn(columnId: string, toIndex: number): void;
}
