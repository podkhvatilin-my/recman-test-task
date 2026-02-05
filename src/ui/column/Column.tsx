import { useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DnDItemType } from "../../infrastructure/dnd";
import { useBoard } from "../../application/hooks/useBoard";
import { useSearch } from "../../application/hooks/useSearch";
import { useFilter } from "../../application/hooks/useFilter";
import { TaskCard } from "../task/TaskCard";
import { ColumnHeader } from "./ColumnHeader";
import { AddTaskForm } from "./AddTaskForm";
import styles from "./Column.module.css";

interface ColumnProps {
  columnId: string;
  isMobile?: boolean;
}

export function Column({ columnId, isMobile }: ColumnProps) {
  const { board } = useBoard();
  const { deferredQuery } = useSearch();
  const { filter } = useFilter();
  const taskScrollRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  const column = board.columns.find((c) => c.id === columnId);

  const visibleTaskIds = useMemo(() => {
    if (!column) return [];

    return column.taskIds.filter((taskId) => {
      const task = board.tasks[taskId];
      if (!task) return false;

      if (filter !== "all" && task.status !== filter) return false;

      if (deferredQuery.trim()) {
        const lowerText = task.text.toLowerCase();
        const lowerQuery = deferredQuery.toLowerCase();
        if (!lowerText.includes(lowerQuery)) return false;
      }

      return true;
    });
  }, [column, board.tasks, filter, deferredQuery]);

  const taskVirtualizer = useVirtualizer({
    count: visibleTaskIds.length,
    getScrollElement: () => taskScrollRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ type: DnDItemType.TASK, columnId }),
      canDrop: ({ source }) => source.data.type === DnDItemType.TASK,
    });
  }, [columnId]);

  if (!column) return null;

  const useVirtual = !isMobile && visibleTaskIds.length > 20;

  return (
    <div ref={columnRef} className={styles.column}>
      <ColumnHeader columnId={columnId} />
      <div ref={taskScrollRef} className={styles.taskList}>
        {useVirtual ? (
          <div
            style={{
              height: `${taskVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {taskVirtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={visibleTaskIds[virtualItem.index]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <TaskCard
                  taskId={visibleTaskIds[virtualItem.index]}
                  columnId={columnId}
                  index={virtualItem.index}
                />
              </div>
            ))}
          </div>
        ) : (
          visibleTaskIds.map((taskId, idx) => (
            <TaskCard key={taskId} taskId={taskId} columnId={columnId} index={idx} />
          ))
        )}
      </div>
      <AddTaskForm columnId={columnId} />
    </div>
  );
}
