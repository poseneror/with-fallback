export type Fetcher<ValueType> = () => Promise<ValueType>
export type FetcherModifier<ValueType, OptionsType> = (fetcher: Fetcher<ValueType>, options: OptionsType) => Promise<ValueType>