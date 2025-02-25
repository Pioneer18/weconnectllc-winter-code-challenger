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
}

export type TaskStateManagerReturn = [
  boolean,
  boolean,
  string | null,
  Task[],
  () => void
];

export interface PaginatedTasks {
  tasks: Task[];
  hasMore: boolean;
}