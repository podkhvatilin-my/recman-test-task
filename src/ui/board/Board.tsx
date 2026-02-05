import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useBoard } from "../../application/hooks/useBoard";
import { useActiveColumn } from "../../application/hooks/useActiveColumn";
import { Column } from "../column/Column";
import styles from "./Board.module.css";

export function Board() {
  const { board } = useBoard();
  const { activeColumnId } = useActiveColumn();
  const scrollRef = useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: board.columns.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 292,
    overscan: 2,
  });

  const useVirtual = board.columns.length > 10;

  return (
    <>
      <div ref={scrollRef} className={styles.board}>
        {useVirtual
          ? (
            <div
              style={{
                width: `${columnVirtualizer.getTotalSize()}px`,
                height: "100%",
                position: "relative",
                display: "flex",
              }}
            >
              {columnVirtualizer.getVirtualItems().map((virtualCol) => {
                const column = board.columns[virtualCol.index];
                return (
                  <div
                    key={column.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      transform: `translateX(${virtualCol.start}px)`,
                    }}
                  >
                    <Column columnId={column.id} />
                  </div>
                );
              })}
            </div>
          )
          : board.columns.map((col) => (
            <Column key={col.id} columnId={col.id} />
          ))
        }
      </div>

      <div className={styles.boardMobile}>
        {activeColumnId && (
          <Column columnId={activeColumnId} isMobile />
        )}
      </div>
    </>
  );
}
