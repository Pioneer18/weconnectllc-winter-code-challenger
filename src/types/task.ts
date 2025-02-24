export interface Task {
  id: number;
  title: string;
  completed: boolean;
  description: string;
};

export type TaskStateManagerProps = [
  boolean,
  boolean,
  string | null,
  Task[],
  number,
  (val: (prevPage: number) => number) => void
];