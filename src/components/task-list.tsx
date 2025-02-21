"use client";

import { useEffect, useState, memo, Component } from "react";
import { Task } from "@/types/task";
import TaskItem from "./task-item";

const LoadingState = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="h-24 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700"
      />
    ))}
  </div>
);

class TaskErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4 text-center">
          Something went wrong. Please try again.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTasks = async (pageNum: number) => {
    setLoading(true);
    const response = await fetch(`/api/tasks?page=${pageNum}`);
    const data = await response.json();

    setTasks((prev) => [...prev, ...data.tasks]);
    setHasMore(data.hasMore);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page, loading, hasMore]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <TaskErrorBoundary>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}

        <button
          onClick={handleLoadMore}
          className="w-full p-4 text-center text-gray-600 hover:text-gray-900"
        >
          Load more tasks
        </button>
      </div>
    </TaskErrorBoundary>
  );
}
