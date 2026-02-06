import { useSelectionContext } from "../../application/context/SelectionContext";
import { Toolbar } from "../toolbar/Toolbar";
import { Board } from "../board/Board";
import { BulkActionBar } from "../bulk/BulkActionBar";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  const { count } = useSelectionContext();

  return (
    <div className={styles.appLayout}>
      <Toolbar />
      <Board />
      {count > 0 && <BulkActionBar />}
    </div>
  );
}
