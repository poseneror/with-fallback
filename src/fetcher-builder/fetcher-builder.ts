import { Fetcher, FetcherModifier } from "../types";
import { withVerfication, ResponseVerifier } from "../fetcher-modifiers/with-verification";
import { withLogger, Logger } from "../fetcher-modifiers/with-logger";
import { withBackup } from "../fetcher-modifiers/with-backup";
import { RetryOptions, withRetry } from "../fetcher-modifiers/with-retry";
import { withFallback } from "../fetcher-modifiers/with-fallback";

interface WithFallbackOptions<ValueType> {
    logger?: Logger;
    retry?: RetryOptions;
    verifier?: ResponseVerifier<ValueType>;
    backupFetcher?: Fetcher<ValueType>;
}

function maybeModifyFetcher<ValueType, OptionsType>(fetcher: Fetcher<ValueType>, modifier: FetcherModifier<ValueType, OptionsType>, options?: OptionsType): Fetcher<ValueType> {
    return options ? () => modifier(() => fetcher(), options) : fetcher;
}

export default async function buildFetcher<ValueType>(fetcher: Fetcher<ValueType>, fallback: ValueType, { logger, retry, verifier, backupFetcher }: WithFallbackOptions<ValueType> = {}): Promise<ValueType> {
    fetcher = maybeModifyFetcher(fetcher, withVerfication, verifier);
    fetcher = maybeModifyFetcher(fetcher, withLogger, logger);
    if (backupFetcher) {
        backupFetcher = maybeModifyFetcher(backupFetcher, withVerfication, verifier);
        backupFetcher = maybeModifyFetcher(backupFetcher, withLogger, logger);
    }
    fetcher = maybeModifyFetcher(fetcher, withBackup, backupFetcher);
    fetcher = maybeModifyFetcher(fetcher, withRetry, retry);
    fetcher = maybeModifyFetcher(fetcher, withFallback, fallback);
    return fetcher();
}