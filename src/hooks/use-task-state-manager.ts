"use-client";

import { Task, TaskStateManagerProps } from "@/types/task";
import { useCallback, useEffect, useState } from "react";
import { getSessionStorage, setSessionStorage } from "./utils/session-storage-utils";
import { TASKS_KEY, PAGE_KEY } from "@/constants";

type Action = 
    | {type: 'FETCHING_TASKS_INIT'} // loading true, 
    | {type: 'FETCHING_TASKS_FAILURE'} // error true
    | {type: 'FETCHING_TASKS_SUCCESS'} // loading false, page,tasks, and has more updated, error false

const tasksReducer = (state: TaskStateManagerProps, action: Action) => {
}

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

            setTasks((prev) => {
                const update = [...prev, ...data.tasks];
                setSessionStorage(TASKS_KEY, update);
                return update;
            })

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