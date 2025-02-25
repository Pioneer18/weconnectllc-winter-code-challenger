import { TASKS_KEY, PAGE_KEY } from "@/constants";

const isBrowser = typeof window != 'undefined';

export const getSessionStorage = <T>(key: string, fallback: T): T => {
    if (!isBrowser) return fallback;
    
    try {
        const val = sessionStorage.getItem(key);
        if (val) {
            if (key === PAGE_KEY) return Number(val) as T;
            if (key === TASKS_KEY) return JSON.parse(val) as T;
        }
    } catch (e) {
        // don't actually throw the error but log it so this failure isn't totally hidden
        console.error(`Get session storage failure: ${e}`);
        return fallback;
    }

    return fallback;
}

export const setSessionStorage = <T>(key: string, val: T | T[]): void => {
    try {
        const input = typeof val == 'number' ? val.toString() : JSON.stringify(val);
        if (isBrowser) sessionStorage.setItem(key, input)
    } catch (e) {
        throw e;
    }
};
