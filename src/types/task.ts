export interface Task {
  id: number;
  title: string;
  completed: boolean;
  description: string;
};

export interface TaskStateManagerProps {
  loading: boolean,
  hasMore: boolean,
  error: string | null,
  tasks: Task[],
  page: number,
  setPage: (val: number) => void // is this correct way to update?
}

export type TaskStateManagerReturn = [
  boolean,
  boolean,
  string | null,
  Task[],
  number,
  (val: number) => void
];