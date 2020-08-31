import { Fetcher } from "../types";
import { wait } from "../utils/utils";
export interface RetryOptions {
    amount: number;
    duration: number;
}

const defaultRetry = { amount: 0, duration: 1000 };

export async function withRetry<ValueType>(fetcher: Fetcher<ValueType>, options: RetryOptions = defaultRetry): Promise<ValueType> {
    for (let i = 0; i <= options.amount; i++) {
        try {
            return await fetcher();
        } catch {
            if (i < options.amount) {
                await wait(options.duration);
            }
        }
    }
    throw new Error('retry limit acheived');
}