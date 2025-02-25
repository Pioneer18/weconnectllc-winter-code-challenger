
import { Task, TaskStateManagerProps, TaskStateManagerReturn } from "@/types/task";
import { useCallback, useEffect, useReducer} from "react";
import { getSessionStorage, setSessionStorage } from "./utils/session-storage-utils";
import { TASKS_KEY, PAGE_KEY } from "@/constants";

type Action =
    | { type: 'LOAD_SESSION_STATE'; tasks: Task[], page: number}
    | { type: 'INCREMENT_PAGE' }
    | { type: 'FETCHING_TASKS_INIT' }
    | { type: 'FETCHING_TASKS_FAILURE'; error: string; }
    | { type: 'FETCHING_TASKS_SUCCESS'; tasks: Task[]; hasMore: boolean; } // why page?

// state is updated based on given state and action
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
            setSessionStorage(PAGE_KEY, state.page); // this fires when state of page has been updated

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

    // don't prematurely attempt to access sessionStorage 
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTasks = getSessionStorage(TASKS_KEY, initialTasks);
            const storedPage = getSessionStorage(PAGE_KEY, initialPage);
            dispatch({ type: 'LOAD_SESSION_STATE', tasks: storedTasks, page: storedPage });
        }
    }, []);

    const fetchTasks = useCallback(async (pageNum: number) => {
        try {
            dispatch({ type: 'FETCHING_TASKS_INIT' })

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
    }, []);

    useEffect(() => {
        fetchTasks(state.page);
    }, [state.page]);


    // need a state updater for the page!
    const nextPage = () => {
        console.log('incrementing page...')
        dispatch({type: 'INCREMENT_PAGE' })
        console.log(state.page);
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