function defaultLogger(error: any) {
    console.warn('fallback', error);
}

const defaultRetry = { amount: 0, duration: 1000 };

interface RetryOptions {
    amount: number;
    duration: number;
}

interface WithFallbackOptions {
    logger?: (error: any) => void;
    retry?: RetryOptions;
}

async function wait(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function withFallback<ValueType>(fetcher: () => Promise<ValueType>, fallback: ValueType, { logger = defaultLogger, retry = defaultRetry }: WithFallbackOptions = {}): Promise<ValueType> {
    for (let i = 0; i <= retry.amount; i++) {
        try {
            return await fetcher();
        } catch (error) {
            logger(error);
            if (i < retry.amount) {
                await wait(retry.duration);
            }
        }
    }
    return fallback;
}