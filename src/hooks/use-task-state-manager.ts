"use-client"

import { Task, TaskStateManagerProps, TaskStateManagerReturn } from "@/types/task";
import { useCallback, useEffect, useReducer, useState} from "react";
import { getSessionStorage, setSessionStorage } from "./utils/session-storage-utils";
import { TASKS_KEY, PAGE_KEY } from "@/constants";

type Action =
    | { type: 'LOAD_SESSION_STATE'; tasks: Task[], page: number}
    | { type: 'INCREMENT_PAGE' }
    | { type: 'FETCHING_TASKS_INIT' }
    | { type: 'FETCHING_TASKS_FAILURE'; error: string; }
    | { type: 'FETCHING_TASKS_SUCCESS'; tasks: Task[]; hasMore: boolean; } // why page?

let incrementFlag = false;
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
            // sessionStorage only updated on success!)git 
            const updatedTasks = [...state.tasks, ...action.tasks];
            setSessionStorage(TASKS_KEY, updatedTasks);
            setSessionStorage(PAGE_KEY, state.page);

            return {
                ...state,
                loading: false,
                error: null,
                tasks: updatedTasks,
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

const useTaskStateManager = (initialTasks: Task[], initialPage: number): TaskStateManagerReturn => {
    const [state, dispatch] = useReducer(tasksReducer, {
        tasks: initialTasks,
        page: initialPage,
        loading: false,
        error: null,
        hasMore: true,
    });

    // on page state is set from what is in the sessionStorage
    // at first that's nothing, so task is set to [] and page 1
    // fetch loads the first 5 tasks and sets them into session storage
    // reload the page and this will retrieve the tasks AND page 1
    // the fetch will fire and load the same 5 tasks that were just taken out of storage!
    // solution: 
    // everything fires on reload, but must decide if using session storage or using fetched data!

    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTasks = getSessionStorage(TASKS_KEY, initialTasks);
            const storedPage = getSessionStorage(PAGE_KEY, initialPage);

            dispatch({ type: 'LOAD_SESSION_STATE', tasks: storedTasks, page: storedPage });

            // fetch ONLY if sessionStorage has no tasks
            if (storedTasks.length === 0) {
                setShouldFetch(true);
            }
        }
    }, []);

    const fetchTasks = useCallback(async (pageNum: number) => {
        console.log('fetching tasks...')
        try {
            dispatch({ type: 'FETCHING_TASKS_INIT' })

            // check if incomig page is differnt from what's in storage?
            const response = await fetch(`/api/tasks?page=${pageNum}`);
            const latestTasks = await response.json();

            dispatch({
                type: 'FETCHING_TASKS_SUCCESS',
                tasks: latestTasks.tasks,
                hasMore: latestTasks.hasMore
            })
        } catch (e) {
            console.error(`Fetch tasks error: ${e}`);
            dispatch({ type: 'FETCHING_TASKS_FAILURE', error: `Fetching tasks failed: ${e}` });
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
        dispatch({type: 'INCREMENT_PAGE' })
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