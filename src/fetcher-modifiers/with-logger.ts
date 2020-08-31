import { Fetcher } from "../types";

export async function withLogger<ValueType>(fetcher: Fetcher<ValueType>, logger: (error: any) => void) {
    try {
        return await fetcher();
    } catch (error) {
        logger(error);
    }
    throw new Error('with logger - fetch failed');
}