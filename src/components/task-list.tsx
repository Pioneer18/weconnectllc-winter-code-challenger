"use client";

import { useEffect, useState, Component } from "react";
import { Task } from "@/types/task";
import TaskItem from "./task-item";
import React from "react";

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

  // memoize fetchTasks and only recreate if page has changed
  const fetchTasks = React.useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks?page=${pageNum}`);
      const data = await response.json();

      setTasks((prev) => [...prev, ...data.tasks]);
      setHasMore(data.hasMore);
    } catch (e) {
      setError(`Fetch tasks error: ${e}`);
    }
    setLoading(false);
  }, [page])

  // note: This fires twice if the start button is selected from the app page,
  // works fine on page refresh or manually entering the url
  useEffect(() => {
    fetchTasks(page);
  }, [fetchTasks, page]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <TaskErrorBoundary>
      {loading ? LoadingState() : 
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
          {hasMore == false ? null :
            <button
              onClick={handleLoadMore}
              className="w-full p-4 text-center text-gray-600 hover:text-gray-900"
            >
              Load more tasks
            </button>
          }
        </div>
      }
    </TaskErrorBoundary>
  );
}
