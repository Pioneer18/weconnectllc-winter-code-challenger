/**
 * Interfaces
 */
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  description: string;
};

export interface TaskStateManagerProps {
  loading: boolean,
  hasMore: boolean,
  error: string | undefined,
  tasks: Task[],
  page: number,
}

export interface FetchTasksResponse {
  tasks: Task[],
  hasMore: boolean;
}

/**
 * Types
 */

export type TaskStateManagerReturn = [
  boolean,
  boolean,
  string | undefined,
  Task[],
  () => void
];