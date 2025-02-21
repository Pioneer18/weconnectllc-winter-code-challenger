import { NextRequest, NextResponse } from "next/server";
import { Task } from "@/types/task";

let tasks: Task[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Task ${index + 1}`,
  completed: Math.random() > 0.5,
  description: `This is a detailed description for task ${index + 1}`,
}));

const getTasks = () => {
  return tasks.map((task) => ({
    ...task,
    completed: task.completed,
  }));
};

const getPaginatedTasks = (page: number, pageSize: number) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const allTasks = getTasks();

  return {
    tasks: allTasks.slice(startIndex, endIndex),
    hasMore: endIndex < allTasks.length,
  };
};

const getPageParam = (searchParams: URLSearchParams) => {
  const page = parseInt(searchParams.get("page") || "1");
  if (isNaN(page) || page < 1) {
    throw new Error("Invalid page parameter");
  }
  return page;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = getPageParam(searchParams);
    const pageSize = 5;

    const result = getPaginatedTasks(page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
