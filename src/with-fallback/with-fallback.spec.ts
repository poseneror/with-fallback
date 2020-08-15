import { withFallback } from "./with-fallback";

describe('with fallback', () => {
    const expectedValue = 'some-value';
    const expectedFallbackValue = 'some-fallback-value';

    it('should return the resolved value', async () => {
        const fetcher = () => Promise.resolve(expectedValue);

        const response = await withFallback(fetcher, expectedFallbackValue);

        expect(response).toEqual(expectedValue);
    });

    it('should return the fallback value if fetcher failed', async () => {
        const fetcher = () => Promise.reject();

        const response = await withFallback(fetcher, expectedFallbackValue);

        expect(response).toEqual(expectedFallbackValue);
    });

    it('should log error on fetcher failure', async () => {
        const expectedError = new Error('some-error-message')
        spyOn(console, 'log');
        const fetcher = () => Promise.reject(expectedError);

        await withFallback(fetcher, expectedFallbackValue);

        expect(console.log).toHaveBeenCalledWith('fallback', expectedError);
    });

    it('should log error using provided logger on fetcher failure', async () => {
        const expectedError = new Error('some-error-message')
        const logger = jest.fn();
        const fetcher = () => Promise.reject(expectedError);

        await withFallback(fetcher, expectedFallbackValue, {logger});

        expect(logger).toHaveBeenCalledWith(expectedError);
    });
    describe('retry', () => {
        it('should retry on fetcher failure with default duration', async () => {
            const expectedError = new Error('some-error-message')
            const duration = 1000;
            const fetcher = jest.fn().mockResolvedValue(expectedValue)
                .mockImplementationOnce(() => {
                throw expectedError
            });

            const response = await withFallback(fetcher, expectedFallbackValue, { retry: {amount: 1, duration} });
            
            expect(fetcher).toHaveBeenCalledTimes(2);
            expect(response).toEqual(expectedValue);
        });
    });

    describe('verifier', () => {
        it('should fallback after verifing the fetchers response', async () => {
            const notOkResponse = 'I failed :(';
            const fetcher = () => Promise.resolve(notOkResponse);
            const verifier = (response: string) => response !== notOkResponse;

            const response = await withFallback(fetcher, expectedFallbackValue, { verifier });

            expect(response).toEqual(expectedFallbackValue);
        });

        it('should fallback after verifing the fetchers response', async () => {
            const notOkResponse = 'I failed :(';
            const expectedOkResponse = 'I good :)';
            const fetcher = () => Promise.resolve(expectedOkResponse);
            const verifier = (response: string) => response !== notOkResponse;

            const response = await withFallback(fetcher, expectedFallbackValue, { verifier });

            expect(response).toEqual(expectedOkResponse);
        });
    });
});