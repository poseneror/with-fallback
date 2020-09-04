import { Fetcher } from "../types";

export type Logger = (error: any) => void

export async function withLogger<ValueType>(fetcher: Fetcher<ValueType>, logger: Logger) {
    try {
        return await fetcher();
    } catch (error) {
        logger(error);
    }
    throw new Error('with logger - fetch failed');
}