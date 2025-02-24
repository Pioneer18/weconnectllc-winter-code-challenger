"use client";

import TaskList from "@/components/task-list";

export default function StartPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 w-full max-w-7xl">
        {/* Challenge Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Next.js Task Manager Technical Assessment
          </h1>
          <p className="text-lg max-w-[600px] text-gray-600 dark:text-gray-300">
            This technical assessment evaluates your debugging and
            problem-solving abilities in a Next.js application. You&apos;ll need to
            identify and resolve issues in both component architecture and API
            implementation.
          </p>
          <div className="mt-6 flex gap-4 font-[family-name:var(--font-geist-mono)] text-sm">
            <div className="px-4 py-2 bg-background border border-solid border-border rounded-md">
              <span className="text-foreground font-medium">
                Component Complexity:
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Level 5
              </span>
            </div>
            <div className="px-4 py-2 bg-background border border-solid border-border rounded-md">
              <span className="text-foreground font-medium">
                API Complexity:
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Level 2
              </span>
            </div>
          </div>
        </div>

        {/* Technical Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-background border border-solid border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Component Architecture Requirements
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4 text-gray-600 dark:text-gray-300 font-[family-name:var(--font-geist-mono)] text-sm">
                <li className="flex items-start">
                  <span className="mr-3">01.</span>
                  <span>
                    Fix loading state issues: The loading indicator is not
                    showing correctly during data fetching, and the load more
                    button should be disabled while loading
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">02.</span>
                  <span>
                    Handle component errors: Implement proper error handling for
                    API requests and display error messages to users
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">03.</span>
                  <span>
                    Fix performance issues: Tasks are re-rendering
                    unnecessarily. Implement proper component memoization and
                    fix dependency arrays
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">04.</span>
                  <span>
                    Fix state management bugs: Multiple state updates are
                    causing unnecessary re-renders. Consider consolidating state
                    into a single object
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">05.</span>
                  <span>
                    Add missing TypeScript types: Some components are missing
                    proper type definitions for props and state
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-background border border-solid border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                API Implementation Requirements
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4 text-gray-600 dark:text-gray-300 font-[family-name:var(--font-geist-mono)] text-sm">
                <li className="flex items-start">
                  <span className="mr-3">01.</span>
                  <span>
                    Fix data persistence: Tasks are not persisting between page
                    reloads. Implement basic data storage
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">02.</span>
                  <span>
                    Fix data mutation bugs: Task updates are not being handled
                    correctly. Ensure immutable state updates
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">03.</span>
                  <span>
                    Add input validation: The page parameter needs validation to
                    prevent negative numbers and non-numeric values
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">04.</span>
                  <span>
                    Fix pagination issues: The pagination calculation is
                    incorrect, causing tasks to be skipped or duplicated
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">05.</span>
                  <span>
                    Add error handling: API errors need proper status codes and
                    error messages for better client handling
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Implementation */}
        <div className="bg-background border border-solid border-border rounded-lg mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Task Manager Implementation
            </h2>
          </div>
          <div className="p-6">
            <TaskList />
          </div>
        </div>

        {/* Technical Notes */}
        <div className="bg-background border border-solid border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Technical Investigation Points
          </h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300 font-[family-name:var(--font-geist-mono)] text-sm">
            <li>→ Check for infinite loops in useEffect dependencies</li>
            <li>→ Review API response handling and error states</li>
            <li>→ Look for unnecessary component re-renders</li>
            <li>→ Check state update patterns</li>
            <li>→ Verify proper TypeScript usage</li>
          </ul>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <p>WeConnect LLC</p>
      </footer>
    </div>
  );
}
