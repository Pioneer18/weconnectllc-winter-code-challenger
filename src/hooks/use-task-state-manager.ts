import { Task } from "@/types/task";
import { useCallback, useEffect, useState } from "react";

// todo:
// initial tasks state and page should be loaded from session storage,
// as well as the hasMore value?
// loading should always default false?
const useTaskStateManager = (): [boolean, boolean, string | null, Task[], number, (val: number) => void] => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchTasks = useCallback(async (pageNum: number) => {
    try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tasks?page=${pageNum}`);
        const data = await response.json();

        setTasks((prev) => [...prev, ...data.tasks]);
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
        setPage // critical for updating the state
    ];
}

export default useTaskStateManager;