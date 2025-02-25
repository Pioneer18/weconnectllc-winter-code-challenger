"use client";

import { TaskItem } from "../task-item/task-item";
import TaskErrorBoundary from "../error-handling/task-error-boundary";
import LoadingState from "./task-list-loading";
import React, { useState } from "react";
import useTaskStateManager from "@/hooks/use-task-state-manager";
import { TaskError } from "../error-handling/task-error-alert";

export default function TaskList() {
  const [pageSize, setPageSize] = useState(5);
  const [loading, hasMore, error, tasks, nextPage] = useTaskStateManager([], 1, pageSize);

  const handleLoadMore = () => {
    nextPage();
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
  }

  return (
    <TaskErrorBoundary>
      <div className="space-y-4">
        {error &&
          <TaskError error={error} />
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

        <div className="flex items-center space-x-2">
          <label >Choose Number of Tasks to load</label>
          <select 
            className="w-1/10 p-2 border rounded"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>
    </TaskErrorBoundary>
  );
}
