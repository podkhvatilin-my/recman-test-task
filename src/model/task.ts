export const TaskStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  createdAt: number;
}
