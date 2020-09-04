import { Fetcher } from "../types";

export type ResponseVerifier<ValueType> = (response: ValueType) => boolean;

export async function withVerfication<ValueType>(fetcher: Fetcher<ValueType>, verifier: ResponseVerifier<ValueType>) {
    const response = await fetcher();
    if (verifier(response) === false) {
        throw new Error('response verification failed');
    }
    return response;
}