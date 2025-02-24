import { Task, TaskStateManagerProps } from "@/types/task";
import { useCallback, useEffect, useState } from "react";
const TASKS_KEY = 'TASKS';
const PAGE_KEY = 'PAGE'

const useTaskStateManager = (initialTasks: Task[], initialPage: number): TaskStateManagerProps => {
    // multiple stateful values are still being used instead of single object
    // useReducer "makes sense as soon as multiple stateful values are dependent on each other or related to one domain"

    const isBrowser = typeof window != 'undefined';
    const getSessionStorage = (key: string) => {
        if (!isBrowser) {
            if (key === PAGE_KEY) return initialPage;
            if (key === TASKS_KEY) return initialTasks;
            throw new Error('Invalid sessionStorage key provided');
        }

        const val = sessionStorage.getItem(key);
        if (val) {
            if (key === PAGE_KEY) return Number(val);
            if (key === TASKS_KEY) return JSON.parse(val);
        }

        // no value found in the cache
        if (key === PAGE_KEY) return initialPage;
        if (key === TASKS_KEY) return initialTasks;
        throw new Error('Invalid sessionStorage key provided');
    }
    const setSessionStorage = (key: string, val: number | Task[]) => {
        try {
            const input = typeof val == 'number' ? val.toString() : JSON.stringify(val);
            if (isBrowser) sessionStorage.setItem(key, input)
        } catch (e) {
            throw new Error(`Failed to store value in sessionStorage: ${e}`);
        }
    };

    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            return getSessionStorage(TASKS_KEY);
        } catch (e) {
            console.error(`Error retrieving cached tasks: ${e}`);
            return initialTasks;
        }
    });

    const [page, setPage] = useState<number>(() => {
        try {
            if (isBrowser) {
                const cachedPage = sessionStorage.getItem(PAGE_KEY);
                return cachedPage ? Number(cachedPage) : initialPage;
            }
            return initialPage;
        } catch (e) {
            console.error(`Error retriveing cached page: ${e}`);
            return initialPage;
        }
    });

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