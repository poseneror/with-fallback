# with-fallback
[![npm version](https://badge.fury.io/js/with-fallback.svg)](https://badge.fury.io/js/with-fallback)

Wraps a function with a fallback value which will be returned in case the function fails.

## install
---

```bash
npm install with-fallback
```

## usage
---

```js
import withFallback from 'with-fallback'

async function fetchUserImage(uid) {
    const userResponse = await fetch(`https://my-server/api/users/${uid}`);
    const userDto = await userResponse.json();
    return userDto.image;
}

const userImage = withFallback(() => fetchUserImage(1), {
    url: 'default_profile.png',
    width: 50,
    height: 50,
});
```

## Api
---

### `withFallback(`fetcher, fallback, options`)`
### Arguments:
 - fetcher: `() => Promise<ValueType>` - an async / sync function that returns a value of type \<ValueType>.
 - fallback: `ValueType` - a fallback value of type \<ValueType> that will be returned in case `fetcher` fails (throws)
 - options: `WithFallbackOptions`:
   - logger: `(error: Any) => void` - a logger which will be invoked when a fallback occours.  (default logger is `console.warn`)
    - retry: `RetryOptions:`
        - amount: `number` - the maximum amount of retries to perform (default amount is `0`)
        - duration: `number` - waiting time between retries - in ms (default duration is `1000` ms)

### Return Value: 
 - `Promise<ValueType>`

## Typescript Support
---
*withFallback* is strongly typed. 
And it enforces the fallback value to be of the same type as the fetcher's return value.

