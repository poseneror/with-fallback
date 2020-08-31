import { Fetcher } from "../types";

export async function withVerfication<ValueType>(fetcher: Fetcher<ValueType>, verifier: (response: ValueType) => boolean) {
    const response = await fetcher();
    if (verifier(response) === false) {
        throw new Error('response verification failed');
    }
    return response;
}