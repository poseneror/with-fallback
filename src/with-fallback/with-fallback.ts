function defaultLogger(error: any) {
    console.warn('fallback', error);
}

const defaultRetry = { amount: 0, duration: 1000 };

const defaultVerifier = () => true;

const fetchApiVerifier = () => true;
interface RetryOptions {
    amount: number;
    duration: number;
}

interface WithFallbackOptions<ValueType> {
    logger?: (error: any) => void;
    retry?: RetryOptions;
    verifier?: (response: ValueType) => boolean;
}

async function wait(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function withFallback<ValueType>(fetcher: () => Promise<ValueType>, fallback: ValueType, { logger = defaultLogger, retry = defaultRetry, verifier = defaultVerifier }: WithFallbackOptions<ValueType> = {}): Promise<ValueType> {
        for (let i = 0; i <= retry.amount; i++) {
            try {
                const response = await fetcher();
                if (!verifier(response)){
                    throw new Error('response verification failed');
                }
                return response;
            } catch (error) {
                logger(error);
                if (i < retry.amount) {
                    await wait(retry.duration);
                }
            }
        }
    return fallback;
}