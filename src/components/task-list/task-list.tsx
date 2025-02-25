"use client";

import TaskItem from "../task-item/task-item";
import TaskErrorBoundary from "../error-handling/task-error-boundary";
import LoadingState from "./task-list-loading";
import React from "react";
import useTaskStateManager from "@/hooks/use-task-state-manager";

export default function TaskList() {
  const [loading, hasMore, error, tasks, nextPage] = useTaskStateManager([], 1);

  const handleLoadMore = () => {
    nextPage();
  };

  return (
    <TaskErrorBoundary> {/* confirm this is being implemented */}
      <div className="space-y-4">
        {error &&
          <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
        }
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
