function defaultLogger(error: any) {
    console.warn('fallback', error);
}

export async function withFallback<ValueType>(fetcher: () => Promise<ValueType>, fallback: ValueType, logger = defaultLogger): Promise<ValueType> {
    try {
        return await fetcher();
    } catch(error) {
        logger(error);
        return fallback;
    }
}