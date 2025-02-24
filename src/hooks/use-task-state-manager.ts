
import { Task, TaskStateManagerProps, TaskStateManagerReturn } from "@/types/task";
import { useCallback, useEffect, useReducer, useState } from "react";
import { getSessionStorage, setSessionStorage } from "./utils/session-storage-utils";
import { TASKS_KEY, PAGE_KEY } from "@/constants";

type Action =
    | { type: 'FETCHING_TASKS_INIT' }
    | { type: 'FETCHING_TASKS_FAILURE'; error: string }
    | { type: 'FETCHING_TASKS_SUCCESS'; tasks: Task[]; page: number, hasMore: boolean }

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
            // sessionStorage only updated on success!)
            const updatedTasks = [...state.tasks, ...action.tasks];
            // setSessionStorage(TASKS_KEY, updatedTasks);
            // setSessionStorage(PAGE_KEY, action.page);

            return {
                ...state,
                loading: false,
                error: null,
                tasks: updatedTasks,
                page: action.page,
                hasMore: action.hasMore,
            }
        case 'FETCHING_TASKS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default:
            return state;
    }
}

// need a state updater for the page!
const nextPage = (prevPage: number) => {
    return prevPage += prevPage + 1;
}

const useTaskStateManager = (initialTasks: Task[], initialPage: number): TaskStateManagerReturn => {
    const [state, dispatch] = useReducer(tasksReducer, {
        tasks: initialTasks,//getSessionStorage(TASKS_KEY, initialTasks),
        page: initialPage, //getSessionStorage(PAGE_KEY, initialPage),
        loading: false,
        error: null,
        hasMore: true,
    });

    const fetchTasks = useCallback(async (pageNum: number) => {
        try {
            dispatch({ type: 'FETCHING_TASKS_INIT' })

            const response = await fetch(`/api/tasks?page=${pageNum}`);
            const latestTasks = await response.json();

            dispatch({
                type: 'FETCHING_TASKS_SUCCESS',
                tasks: latestTasks.tasks,
                page: pageNum,
                hasMore: latestTasks.hasMore
            })
        } catch (e) {
            console.error(`Fetch tasks error: ${e}`);
            dispatch({ type: 'FETCHING_TASKS_FAILURE', error: `Fetching tasks failed: ${e}` });
        }
    }, [state.page]);

    useEffect(() => {
        fetchTasks(state.page);
    }, [fetchTasks]);

    return [
        state.loading,
        state.hasMore,
        state.error,
        state.tasks,
        state.page,
        nextPage,
    ];
}

export default useTaskStateManager;