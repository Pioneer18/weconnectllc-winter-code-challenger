import { Task } from "@/types/task";

const TASKS_KEY = 'TASKS';
const PAGE_KEY = 'PAGE'
const isBrowser = typeof window != 'undefined';

// Type specific fallback now passed to the generic getter
export const getSessionStorage = <T>(key: string, fallback: T): T => {
    if (!isBrowser) return fallback;

    const val = sessionStorage.getItem(key);
    if (val) {
        if (key === PAGE_KEY) return Number(val) as T;
        if (key === TASKS_KEY) return JSON.parse(val) as T;
    }

    return fallback;
}

// Set the specified type
export const setSessionStorage = <T>(key: string, val: T | T[]): void => {
    try {
        const input = typeof val == 'number' ? val.toString() : JSON.stringify(val);
        if (isBrowser) sessionStorage.setItem(key, input)
    } catch (e) {
        console.error(`Failed to store value in sessionStorage: ${e}`);
    }
};
