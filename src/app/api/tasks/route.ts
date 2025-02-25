import { NextRequest, NextResponse } from "next/server";
import { FetchTasksResponse, Task } from "@/types/task";

// this should be a databse query, but ok for challenge?
const tasks: Task[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Task ${index + 1}`,
  completed: Math.random() > 0.5,
  description: `This is a detailed description for task ${index + 1}`,
}));

const getTasks = (): Task[] => {
  return tasks.map((task) => ({
    ...task
  }));
};

const getPaginatedTasks = (page: number, pageSize: number): FetchTasksResponse => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const allTasks = getTasks();

  return {
    tasks: allTasks.slice(startIndex, endIndex),
    hasMore: endIndex < allTasks.length,
  };
};

const getPageParam = (searchParams: URLSearchParams): number => {
  const page = parseInt(searchParams.get("page") || "1");
  if (isNaN(page) || page < 1) {
    throw new Error("Invalid page parameter");
  }
  return page;
};

const getPageSizeParam = (searchParams: URLSearchParams): number => {
  const pageSize = parseInt(searchParams.get("page_size") || "5");
  if (isNaN(pageSize) || pageSize < 1) {
    throw new Error("Invalid pageSize provided")
  }
  return pageSize;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = getPageParam(searchParams);
    const pageSize = getPageSizeParam(searchParams);

    const result = getPaginatedTasks(page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error: GET ${request.url}, ${error}`);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected Server error occurred" }, { status: 500 });
  }
}

// POST
// PUT 
// DELETE
