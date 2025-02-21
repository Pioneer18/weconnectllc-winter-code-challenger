# WeConnect Next.js Technical Challenge

## Overview

This technical assessment evaluates your debugging and problem-solving abilities in a Next.js application. You'll need to identify and resolve issues in both component architecture and API implementation.

## Challenge Description

The challenge involves fixing a Task Manager application that has several intentional bugs and implementation issues. The application allows users to:

- View a list of tasks
- Load more tasks using pagination
- See task details
- Toggle task completion status

## Technical Requirements

### Component Architecture (Level 5)

1. **Loading State Issues**

   - Loading indicator not showing during data fetching
   - Load more button should be disabled while loading
   - Need to implement proper loading states for better UX

2. **Error Handling**

   - API request errors are not properly handled
   - Error messages not displayed to users
   - Error boundary implementation needed

3. **Performance Issues**

   - Tasks are re-rendering unnecessarily
   - Need to implement proper component memoization
   - Fix dependency arrays in useEffect hooks

4. **State Management**

   - Multiple state updates causing unnecessary re-renders
   - State should be consolidated into a single object
   - Implement proper state update patterns

5. **TypeScript Implementation**
   - Missing type definitions for props and state
   - Need to implement proper TypeScript interfaces
   - Add proper type checking

### API Implementation (Level 2)

1. **Data Persistence**

   - Tasks not persisting between page reloads
   - Implement basic data storage solution

2. **Data Mutation**

   - Task updates not handled correctly
   - Need to ensure immutable state updates

3. **Input Validation**

   - Page parameter needs validation
   - Prevent negative numbers and non-numeric values

4. **Pagination**

   - Incorrect pagination calculation
   - Tasks being skipped or duplicated
   - Fix page size handling

5. **Error Handling**
   - Implement proper status codes
   - Add meaningful error messages
   - Improve client-side error handling

## Getting Started

1. Fork this repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       └── route.ts       # API endpoint with issues
│   └── start/
│       └── page.tsx          # Challenge start page
├── components/
│   ├── task-item.tsx        # Task item component
│   └── task-list.tsx        # Task list with issues
└── types/
    └── task.ts              # TypeScript definitions
```

## Evaluation Criteria

Your solution will be evaluated based on:

1. Successfully identifying and fixing the bugs
2. Code quality and organization
3. TypeScript implementation
4. Performance optimizations
5. Error handling implementation

## Technical Investigation Points

- Check for infinite loops in useEffect dependencies
- Review API response handling and error states
- Look for unnecessary component re-renders
- Check state update patterns
- Verify proper TypeScript usage

## Submission Guidelines

1. Create a pull request with your solution
2. Include a description of the issues you found and how you fixed them
3. List any additional improvements you made
4. Provide instructions for testing your changes

## Extra Credit

- Containerize the application using Docker
- Add unit tests for components
- Implement additional features (e.g., task creation, deletion)
- Add documentation for your changes

## Important Notes

- The use of AI tools to complete this challenge is not allowed
- We want to assess your skills and understanding of the technologies involved
- Focus on fixing the core issues before adding extra features

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
