export async function withFallback<ValueType>(fetcher: () => Promise<ValueType>, fallback: ValueType): Promise<ValueType> {
    try {
        const response = await fetcher();
        return response;
    } catch(error) {
        return fallback;
    }
}