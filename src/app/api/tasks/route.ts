/**
 * Are there problem somewhere in this file?
 * 1. data persistence: currently tasks are stored in the browser's sessionStorage, should server persist tasks?
 * 2. data mutation:
 * 3. input validation
 * - prevent negative numbers and non-numeric values
 * - page parameter needs validation
 * 4. pagination: 
 * - page size handling?
 * - incorrect pagination calculation
 * - taks are being skipped or duplicated
 * 5. Error Handling
 * - Implement proper status codes
 * - Add meaningful error messages
 * - Improve client-side error handling
 */

// the README specifies that this file does have issues

import { NextRequest, NextResponse } from "next/server";
import { PaginatedTasks, Task } from "@/types/task";

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

const getPaginatedTasks = (page: number, pageSize: number): PaginatedTasks => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const allTasks = getTasks();

  return {
    tasks: allTasks.slice(startIndex, endIndex),
    hasMore: endIndex < allTasks.length,
  };
};

const getPageParam = (searchParams: URLSearchParams): number => {
  // should there be more validation on page?
  const page = parseInt(searchParams.get("page") || "1");
  if (isNaN(page) || page < 1) {
    throw new Error("Invalid page parameter");
  }
  return page;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = getPageParam(searchParams);
    const pageSize = 5; // this shuoldn't be hardcoded?

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
