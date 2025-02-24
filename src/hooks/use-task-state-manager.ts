"use-client";

import { Task, TaskStateManagerProps, TaskStateManagerReturn } from "@/types/task";
import { useCallback, useEffect, useState } from "react";
import { getSessionStorage, setSessionStorage } from "./utils/session-storage-utils";
import { TASKS_KEY, PAGE_KEY } from "@/constants";

type Action = 
    | {type: 'FETCHING_TASKS_INIT'}
    | {type: 'FETCHING_TASKS_FAILURE'; error: string }
    | {type: 'FETCHING_TASKS_SUCCESS'; tasks: Task[]; page: number, hasMore: boolean}

    // state is updated based on given state and action
const tasksReducer = (state: TaskStateManagerProps, action: Action) => {
    switch (action.type) {
        case 'FETCHING_TASKS_INIT':
            return {
                ...state,
                loading: true,
                error: null,
            }
        case 'FETCHING_TASKS_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                tasks: action.tasks,
                page: action.page,
                hasMore: action.hasMore,
            }
        case 'FETCHING_TASKS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.error
            }
    }
}

const useTaskStateManager = (initialTasks: Task[], initialPage: number): TaskStateManagerReturn => {
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