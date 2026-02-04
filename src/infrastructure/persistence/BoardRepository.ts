import { IBoardRepository } from "../../interface/IBoardRepository";
import { type Board } from "../../model/board";

export class BoardRepository extends IBoardRepository {
  private readonly STORAGE_KEY = "recman-board";

  override load(): Board {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);

      if (data) {
        const parsed: unknown = JSON.parse(data);

        if (this.isValidBoard(parsed)) {
          return parsed;
        }

        console.warn("Invalid board data in storage, returning empty board");
      }

      return this.getEmptyBoard();
    } catch (error) {
      console.error("Failed to load board from storage:", error);

      return this.getEmptyBoard();
    }
  }

  override save(board: Board): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(board));
    } catch (error) {
      console.error("Failed to save board to storage:", error);
    }
  }

  private getEmptyBoard(): Board {
    return {
      tasks: {},
      columns: [],
    };
  }

  private isValidBoard(data: unknown): data is Board {
    return (
      typeof data === "object" &&
      data !== null &&
      "tasks" in data &&
      typeof data.tasks === "object" &&
      data.tasks !== null &&
      "columns" in data &&
      Array.isArray(data.columns)
    );
  }
}
