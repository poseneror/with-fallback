# with-fallback
[![npm version](https://badge.fury.io/js/with-fallback.svg)](https://badge.fury.io/js/with-fallback)

Wraps a function with a fallback value which will be returned in case the function fails.

## setup
```bash
npm install with-fallback
```

## usage
```ts
import withFallback from 'with-fallback'

async function fetchUserImage(uid) {
    const userResponse = await fetch(`https://my-server/api/users/${uid}`);
    const userDto = await userResponse.json();
    return userDto.image;
}

const defaultImage = {
    url: 'default_profile.png',
    width: 50,
    height: 50,
};

const userImage = withFallback(() => fetchUserImage(1), defaultImage);
```

## Api
### `withFallback(`fetcher, fallback, options`)`:
### Arguments:
 - fetcher: `() => Promise<ValueType>` - an async / sync function that returns a value of type \<ValueType>.
 - fallback: `ValueType` - a fallback value of type \<ValueType> that will be returned in case `fetcher` fails (throws)
 - options: `WithFallbackOptions`:
   - logger: `(error: Any) => void` - a logger which will be invoked when a fallback occours.  (default logger is `console.log`)
    - retry: `RetryOptions:`
        - amount: `number` - the maximum amount of retries to perform (default amount is `0`)
        - duration: `number` - waiting time between retries - in ms (default duration is `1000` ms)
    - verifier: `(response: ValueType) => boolean` - a function that verifies the response if it didn't throw an error
    - backupFetcher: `() => Promise<ValueType>` - a secondary fetcher that will be tried if the main fetcher fails (it will invoke alternatively when using `retry` and be `verified` and `logged`)

### Return Value: 
 - `Promise<ValueType>`

### `fetchResponseVerifier`:
Provide as a verifier to handle fetchApi requests

```ts
import withFallback, { fetchResponseVerifier } from 'with-fallback'

const userImage = withFallback(() => fetch(`https://my-server/api/users/${uid}`), fallback, { 
        verifier: fetchResponseVerfier
});
```
This verifies that the response is "ok"

## Typescript Support
*withFallback* is strongly typed. 
And it enforces the fallback value to be of the same type as the fetcher's return value.