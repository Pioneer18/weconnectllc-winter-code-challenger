"use client";

import { useState } from "react";
import { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="task-item">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left focus:outline-none focus:ring-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{task.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              task.completed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>
        <div
          className={`mt-2 text-gray-600 transition-all duration-200 ${
            isExpanded ? "max-h-48" : "max-h-0"
          } overflow-hidden`}
        >
          {task.description}
        </div>
      </button>
    </div>
  );
}
