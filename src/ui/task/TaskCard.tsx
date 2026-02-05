import { useCallback, useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DnDItemType } from "../../infrastructure/dnd";
import { useBoard } from "../../application/hooks/useBoard";
import { useSearch } from "../../application/hooks/useSearch";
import { useSelection } from "../../application/hooks/useSelection";
import { highlightMatch } from "../utils/highlightMatch";
import { TaskEditDialog } from "./TaskEditDialog";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  taskId: string;
  columnId: string;
  index: number;
}

export function TaskCard({ taskId, columnId, index }: TaskCardProps) {
  const { board, taskService } = useBoard();
  const { deferredQuery } = useSearch();
  const { isSelected, toggle, count } = useSelection();
  const task = board.tasks[taskId];
  const draggableRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const el = draggableRef.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ type: DnDItemType.TASK, taskId: task.id, fromColumnId: columnId }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [task?.id, columnId]);

  useEffect(() => {
    const el = draggableRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ type: DnDItemType.TASK, columnId, index }),
      canDrop: ({ source }) => source.data.type === DnDItemType.TASK && source.data.taskId !== taskId,
    });
  }, [taskId, columnId, index]);

  const handleToggle = useCallback(() => {
    taskService.toggleStatus(taskId);
  }, [taskService, taskId]);

  const handleBulkSelect = useCallback(() => {
    toggle(taskId);
  }, [toggle, taskId]);

  const handleOpenEdit = useCallback(() => {
    setEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditOpen(false);
  }, []);

  if (!task) return null;

  const selected = isSelected(taskId);

  let className = styles.taskCard;
  if (task.status === "completed") className += ` ${styles.completed}`;
  if (isDragging) className += ` ${styles.dragging}`;

  return (
    <>
      <div ref={draggableRef} className={className} onClick={handleOpenEdit}>
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={handleToggle}
          onClick={(e) => e.stopPropagation()}
          className={styles.statusCheckbox}
          aria-label={`Mark "${task.text}" as ${task.status === "completed" ? "active" : "completed"}`}
        />
        <div className={styles.text}>
          {highlightMatch(task.text, deferredQuery)}
        </div>
        <input
          type="checkbox"
          checked={selected}
          onChange={handleBulkSelect}
          onClick={(e) => e.stopPropagation()}
          className={`${styles.bulkCheckbox} ${selected || count > 0 ? styles.bulkCheckboxVisible : ""}`}
          aria-label={`Select "${task.text}" for bulk action`}
        />
      </div>
      {editOpen && (
        <TaskEditDialog
          taskId={taskId}
          columnId={columnId}
          open={editOpen}
          onClose={handleCloseEdit}
        />
      )}
    </>
  );
}
