import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import clsx from "clsx";
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
  columnIndex?: number;
  isMobile?: boolean;
}

export function Column({ columnId, columnIndex, isMobile }: ColumnProps) {
  const { board, searchService, filterService } = useBoard();
  const { deferredQuery } = useSearch();
  const { filter } = useFilter();

  const taskScrollRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isTaskDragOver, setIsTaskDragOver] = useState(false);
  const [isColumnDragOver, setIsColumnDragOver] = useState(false);

  const column = board.columns.find((c) => c.id === columnId);

  const visibleTaskIds = useMemo(() => {
    const taskIds = column?.taskIds ?? [];
    const filtered = filterService.filter(taskIds, filter);

    return searchService.search(filtered, deferredQuery);
  }, [column, filterService, searchService, deferredQuery, filter]);

  const taskVirtualizer = useVirtualizer({
    count: visibleTaskIds.length,
    getScrollElement: () => taskScrollRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  // Column as drop target for both tasks and columns
  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: ({ source }) => {
        if (source.data.type === DnDItemType.COLUMN) {
          return { type: DnDItemType.COLUMN, columnId, columnIndex };
        }
        return { type: DnDItemType.TASK, columnId };
      },
      canDrop: ({ source }) => {
        if (source.data.type === DnDItemType.TASK) return true;
        if (source.data.type === DnDItemType.COLUMN)
          return source.data.columnId !== columnId;
        return false;
      },
      onDragEnter: ({ source }) => {
        if (source.data.type === DnDItemType.TASK) setIsTaskDragOver(true);
        else if (source.data.type === DnDItemType.COLUMN)
          setIsColumnDragOver(true);
      },
      onDragLeave: ({ source }) => {
        if (source.data.type === DnDItemType.TASK) setIsTaskDragOver(false);
        else if (source.data.type === DnDItemType.COLUMN)
          setIsColumnDragOver(false);
      },
      onDrop: ({ source }) => {
        if (source.data.type === DnDItemType.TASK) setIsTaskDragOver(false);
        else if (source.data.type === DnDItemType.COLUMN)
          setIsColumnDragOver(false);
      },
    });
  }, [columnId, columnIndex]);

  // Column as draggable (drag handle = header)
  useEffect(() => {
    const el = columnRef.current;
    const handle = headerRef.current;

    if (!el || !handle || columnIndex === undefined) return;

    return draggable({
      element: el,
      dragHandle: handle,
      getInitialData: () => ({ type: DnDItemType.COLUMN, columnId }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [columnId, columnIndex]);

  if (!column) return null;

  const isVirtualized = !isMobile && visibleTaskIds.length > 20;

  return (
    <div
      ref={columnRef}
      className={clsx(styles.column, {
        [styles.columnDragging]: isDragging,
        [styles.taskDragOver]: isTaskDragOver,
        [styles.columnDragOver]: isColumnDragOver,
      })}
    >
      <ColumnHeader columnId={columnId} dragHandleRef={headerRef} />
      <div ref={taskScrollRef} className={styles.taskList}>
        {isVirtualized ? (
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
            <TaskCard
              key={taskId}
              taskId={taskId}
              columnId={columnId}
              index={idx}
            />
          ))
        )}
      </div>
      <AddTaskForm columnId={columnId} />
    </div>
  );
}
