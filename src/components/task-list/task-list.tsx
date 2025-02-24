"use client";

import TaskItem from "../task-item/task-item";
import TaskErrorBoundary from "../error-handling/task-error-boundary";
import LoadingState from "./task-list-loading";
import React from "react";
import useTaskStateManager from "@/hooks/use-task-state-manager";

export default function TaskList() {
  const [loading, hasMore, error, tasks, page, setPage] = useTaskStateManager([], 1);

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
