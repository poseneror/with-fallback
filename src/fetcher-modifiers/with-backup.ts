import { Fetcher } from "../types";

export async function withBackup<ValueType>(fetcher: Fetcher<ValueType>, backupFetcher: Fetcher<ValueType>, logger?: (error: any) => void) {
    const fetchers = [fetcher, backupFetcher];
    for (const currentFetcher of fetchers) {
        try {
            return await currentFetcher();
        } catch { }
    }
    throw new Error('with backup - fetch failed');
}