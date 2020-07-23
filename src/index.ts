export async function withFallback<ResponseType>(fetcher: () => Promise<ResponseType>, fallback: ResponseType) {
    try {
        const response = await fetcher();
        return response;
    } catch(error) {
        return fallback;
    }
}