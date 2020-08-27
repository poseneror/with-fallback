function defaultLogger(error: any) {
    console.log('fallback', error);
}

const defaultRetry = { amount: 0, duration: 1000 };
interface RetryOptions {
    amount: number;
    duration: number;
}

interface WithFallbackOptions<ValueType> {
    logger?: (error: any) => void;
    retry?: RetryOptions;
    verifier?: (response: ValueType) => boolean;
    backupFetcher?: () => Promise<ValueType>;
}

async function wait(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function withFallback<ValueType>(fetcher: () => Promise<ValueType>, fallback: ValueType, { logger = defaultLogger, retry = defaultRetry, verifier, backupFetcher }: WithFallbackOptions<ValueType> = {}): Promise<ValueType> {
    for (let i = 0; i <= retry.amount; i++) {
        try {
            const response = await fetcher();
            if (verifier?.(response) === false) {
                throw new Error('response verification failed');
            }
            return response;
        } catch (fetcherError) {
            logger(fetcherError);
            try {
                const response = await backupFetcher?.();
                if (response) {
                    return response;
                }
            } catch (backupFetcherError) {
                logger(backupFetcherError);
            }
        }
        if (i < retry.amount) {
            await wait(retry.duration);
        }
    }
    return fallback;
}