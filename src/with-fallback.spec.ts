import { withFallback } from ".";

describe('with fallback', () => {
    const expectedValue = 'some-value';
    const expectedFallbackValue = 'some-fallback-value';

    it('should return the resolved value', async () => {
        const fetcher = () => Promise.resolve(expectedValue);

        const response = await withFallback(fetcher, expectedFallbackValue);

        expect(response).toEqual(expectedValue);
    });

    it('should return the fallback value if fetcher failed', async () => {
        const fetcher = () => Promise.reject(expectedFallbackValue);

        const response = await withFallback(fetcher, expectedFallbackValue);

        expect(response).toEqual(expectedFallbackValue);
    });
});