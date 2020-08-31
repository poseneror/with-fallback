import { Fetcher } from "../types";

export async function withFallback<ValueType>(fetcher: Fetcher<ValueType>, fallback: ValueType) {
    try {
        return await fetcher();
    } catch {
        return fallback;
    }
}