"use client";

import { useEffect, useState, Component } from "react";
import { Task } from "@/types/task";
import TaskItem from "../task-item/task-item";
import TaskErrorBoundary from "../error-handling/task-error-boundary";
import LoadingState from "./task-list-loading";
import React from "react";


// todo: there are a lot of useState calls lined up, this should be reduced and customized
export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTasks = React.useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks?page=${pageNum}`);
      const data = await response.json();

      setTasks((prev) => [...prev, ...data.tasks]);
      setHasMore(data.hasMore);
    } catch (e) {
      setError(`Fetch tasks error: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // note: This fires twice if the start button is selected from the app page,
  // works fine on page refresh or manually entering the url
  useEffect(() => {
    fetchTasks(page);
  }, [fetchTasks]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <TaskErrorBoundary>
      <div className="space-y-4">
        { error && <div>{error}</div>}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
        {loading && <LoadingState />}
        {!loading && hasMore &&
          <button
            onClick={handleLoadMore}
            className="w-full p-4 text-center font-bold text-gray-600 hover:text-gray-900"
          >
            Load more tasks
          </button>
        }
      </div>
    </TaskErrorBoundary>
  );
}
