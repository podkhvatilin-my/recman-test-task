import { type Column } from "./column";
import { type Task } from "./task";

export interface Board {
  tasks: Record<string, Task>;
  columns: Column[];
}
