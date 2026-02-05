import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DnDItemType } from "./DnDItemType";
import type { TaskService } from "../../application/services/TaskService";
import type { ColumnService } from "../../application/services/ColumnService";

export function setupDnDMonitor(
  taskService: TaskService,
  columnService: ColumnService,
): () => void {
  return monitorForElements({
    onDrop({ source, location }) {
      const target = location.current.dropTargets[0];
      if (!target) return;

      const sourceData = source.data;
      const targetData = target.data;

      if (sourceData.type === DnDItemType.TASK) {
        const taskId = sourceData.taskId as string;
        const toColumnId = targetData.columnId as string;
        const toIndex = targetData.index as number | undefined;

        if (toColumnId) {
          taskService.moveTask(taskId, toColumnId, toIndex);
        }
      } else if (sourceData.type === DnDItemType.COLUMN) {
        const columnId = sourceData.columnId as string;
        const toIndex = targetData.columnIndex as number;

        if (typeof toIndex === "number") {
          columnService.moveColumn(columnId, toIndex);
        }
      }
    },
  });
}
