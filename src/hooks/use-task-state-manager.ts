import { Task, TaskStateManagerProps } from "@/types/task";
import { useCallback, useEffect, useState } from "react";
const TASKS_KEY = 'TASKS';
const PAGE_KEY = 'PAGE'

const useTaskStateManager = (initialTasks: Task[], initialPage: number): TaskStateManagerProps => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const cachedTasks = sessionStorage.getItem(TASKS_KEY);
            return cachedTasks ? JSON.parse(cachedTasks) : [];
        } catch (e) {
            console.error(`Error retrieving cached tasks: ${e}`);
            return initialTasks
        }
    });

    const [page, setPage] = useState<number>(() => {
        try {
            const cachedPage = sessionStorage.getItem(PAGE_KEY);
            console.log(cachedPage)
            return cachedPage ? Number(cachedPage) : initialPage;
        } catch (e) {
            console.error(`Error retriveing cached page: ${e}`);
            return initialPage
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchTasks = useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            setError(null);
            sessionStorage.setItem(PAGE_KEY, pageNum.toString());

            const response = await fetch(`/api/tasks?page=${pageNum}`);
            const data = await response.json();

            setTasks((prev) => [...prev, ...data.tasks]);
            sessionStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
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