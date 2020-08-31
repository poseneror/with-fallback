import withFallback from "./fetcher-builder";

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
    
    describe('retry', () => {
        it('should retry on fetcher failure with default duration', async () => {
            const expectedError = new Error('some-error-message')
            const duration = 1000;
            const fetcher = jest.fn().mockResolvedValue(expectedValue)
                .mockImplementationOnce(() => {
                    throw expectedError
                });

            const response = await withFallback(fetcher, expectedFallbackValue, { retry: { amount: 1, duration } });

            expect(fetcher).toHaveBeenCalledTimes(2);
            expect(response).toEqual(expectedValue);
        });

        describe('backupFetcher', () => {
            it('should use backupFetcher on fetcher failure', async () => {
                const expectedError = new Error('some-error-message')
                const duration = 1000;
                const fetcher = jest.fn()
                    .mockRejectedValue(expectedError);
                const backupFetcher = jest.fn()
                    .mockResolvedValue(expectedValue)
                    .mockRejectedValueOnce(expectedError);

                const response = await withFallback(fetcher, expectedFallbackValue, { backupFetcher, retry: { amount: 1, duration } });

                expect(fetcher).toHaveBeenCalledTimes(2);
                expect(backupFetcher).toHaveBeenCalledTimes(2);

                expect(response).toEqual(expectedValue);
            });
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

        describe('when backupFetcher is defined', () => {
            it('should use fallback backupFetcher verification failure', async () => {
                const notOkResponse = 'I failed :(';
                const fetcher = () => Promise.reject();
                const verifier = (response: string) => response !== notOkResponse;
                const backupFetcher = () => Promise.resolve(notOkResponse);

                const response = await withFallback(fetcher, expectedFallbackValue, { backupFetcher, verifier });

                expect(response).toEqual(expectedFallbackValue);
            });
        });
    });

    describe('logger', () => {
        it('should log error using provided logger on fetcher failure', async () => {
            const expectedError = new Error('some-error-message')
            const logger = jest.fn();
            const fetcher = () => Promise.reject(expectedError);

            await withFallback(fetcher, expectedFallbackValue, { logger });

            expect(logger).toHaveBeenCalledWith(expectedError);
        });

        describe('when backupFetcher is defined', () => {
            it('should log error on backupFetcher failure', async () => {
                const expectedError = new Error('some-error-message')
                const logger = jest.fn();
                const fetcher = () => Promise.reject(expectedError);
                const backupFetcher = () => Promise.reject(expectedError);

                await withFallback(fetcher, expectedFallbackValue, { backupFetcher, logger });

                expect(logger).toHaveBeenNthCalledWith(2, expectedError);
            });
        })
    })

    describe('backupFetcher', () => {
        it('should use backup fetcher on fetcher failure', async () => {
            const fetcher = () => Promise.reject();
            const backupFetcher = () => Promise.resolve(expectedValue);

            const response = await withFallback(fetcher, expectedFallbackValue, { backupFetcher });

            expect(response).toEqual(expectedValue);
        });
        
    });
});