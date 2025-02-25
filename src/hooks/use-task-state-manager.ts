"use-client"

import { Task, TaskStateManagerProps, TaskStateManagerReturn } from "@/types/task";
import { useCallback, useEffect, useReducer, useState } from "react";
import { getSessionStorage, setSessionStorage } from "./utils/session-storage-utils";
import { TASKS_KEY, PAGE_KEY } from "@/constants";

type Action =
    | { type: 'LOAD_SESSION_STATE'; tasks: Task[], page: number }
    | { type: 'INCREMENT_PAGE' }
    | { type: 'FETCHING_TASKS_INIT' }
    | { type: 'FETCHING_TASKS_SUCCESS'; tasks: Task[]; hasMore: boolean; } // why page?
    | { type: 'ERROR'; error: string; }

const tasksReducer = (state: TaskStateManagerProps, action: Action) => {
    switch (action.type) {
        case 'LOAD_SESSION_STATE':
            return {
                ...state,
                tasks: action.tasks,
                page: action.page,
            }
        case 'INCREMENT_PAGE': // this is what leads to fetchTasks
            return {
                ...state,
                page: state.page + 1,
            }
        case 'FETCHING_TASKS_INIT':
            return {
                ...state,
                loading: true,
                error: null,
            }
        case 'FETCHING_TASKS_SUCCESS':
            // sessionStorage only updated on successful fetch
            const updatedTasks = [...state.tasks, ...action.tasks];
            try {
                setSessionStorage(TASKS_KEY, updatedTasks);
                setSessionStorage(PAGE_KEY, state.page);
            } catch (e) {
                if (e instanceof Error) {
                    throw new Error(`setSessionStorage Failed: ${e.message}`);
                }
                throw e;
            }

            return {
                ...state,
                loading: false,
                error: null,
                tasks: updatedTasks,
                hasMore: action.hasMore,
            }
        case 'ERROR':
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default:
            return state;
    }
}

const useTaskStateManager = (initialTasks: Task[], initialPage: number): TaskStateManagerReturn => {
    const [state, dispatch] = useReducer(tasksReducer, {
        tasks: initialTasks,
        page: initialPage,
        loading: false,
        error: null,
        hasMore: true,
    });

    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // uses fallback if getItem fails
            const storedTasks = getSessionStorage(TASKS_KEY, initialTasks);
            const storedPage = getSessionStorage(PAGE_KEY, initialPage);

            dispatch({ type: 'LOAD_SESSION_STATE', tasks: storedTasks, page: storedPage });

            if (storedTasks.length === 0) {
                setShouldFetch(true);
            }
        }
    }, []);

    // handles it's errors
    const fetchTasks = useCallback(async (pageNum: number) => {
        dispatch({ type: 'FETCHING_TASKS_INIT' })

        const response = await fetch(`/api/tasks?page=${pageNum}`);
        if (response.status === 200) {
            try {
                const latestTasks = await response.json();
                dispatch({
                    type: 'FETCHING_TASKS_SUCCESS',
                    tasks: latestTasks.tasks,
                    hasMore: latestTasks.hasMore
                })
            } catch (e) {
                // needs to be displayed, could lead to glitch
                dispatch({type: 'ERROR', error: `Set session storage failure: ${e}\nTry closing the tab and navigating to the page again.`})
            }

        } else {
            const errorMessage = await response.text();
            dispatch({ type: 'ERROR', error: `API response: ${errorMessage}` }); // this could be presented nicer
        }
    }, [state.page, shouldFetch]);

    useEffect(() => {
        if (shouldFetch) {
            fetchTasks(state.page);
            setShouldFetch(false);
        }
    }, [state.page, shouldFetch, fetchTasks]);


    // need a state updater for the page!
    const nextPage = () => {
        setShouldFetch(true);
        dispatch({ type: 'INCREMENT_PAGE' })
    };

    return [
        state.loading,
        state.hasMore,
        state.error,
        state.tasks,
        nextPage,
    ];
}

export default useTaskStateManager;