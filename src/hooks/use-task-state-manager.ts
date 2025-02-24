import { Task, TaskStateManagerProps } from "@/types/task";
import { useCallback, useEffect, useState } from "react";
import { getSessionStorage, setSessionStorage } from "./utils/session-storage-utils";
const TASKS_KEY = 'TASKS';
const PAGE_KEY = 'PAGE'

const useTaskStateManager = (initialTasks: Task[], initialPage: number): TaskStateManagerProps => {
    // multiple stateful values are still being used instead of single object
    // useReducer "makes sense as soon as multiple stateful values are dependent on each other or related to one domain"

    const [tasks, setTasks] = useState<Task[]>(() => getSessionStorage(TASKS_KEY, initialTasks));
    const [page, setPage] = useState<number>(() => getSessionStorage(PAGE_KEY, initialPage));

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchTasks = useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            setError(null);
            setSessionStorage(PAGE_KEY, pageNum);

            const response = await fetch(`/api/tasks?page=${pageNum}`);
            const data = await response.json();

            setTasks((prev) => [...prev, ...data.tasks]);
            setSessionStorage(TASKS_KEY, tasks) // is this being updated correctly?

            setHasMore(data.hasMore);
        } catch (e) {
            setError(`Fetch tasks error: ${e}`);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchTasks(page);
    }, [fetchTasks]);

    return [
        loading,
        hasMore,
        error,
        tasks,
        page,
        setPage
    ];
}

export default useTaskStateManager;