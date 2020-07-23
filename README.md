# with-fallback [![npm version](https://badge.fury.io/js/with-fallback.svg)](https://badge.fury.io/js/with-fallback)

Wraps a function with a fallback value which will be returned in case the function fails.

Uses defaults:
 - timeout: 10s;
 - interval: 200ms;

## install

```bash
npm install with-fallback
```

## usage

```js
import withFallback from 'with-fallback'

async function fetchUserImage(uid) {
    const userResponse = await fetch(`https://my-server/api/users/${uid}`);
    const userDto = await userResponse.json();
    return userDto.image;
}

const userImage = withFallback(() => fetchUserImage(1), 'default_profile.png');
// fetchUserImage throws => 'default_profile.png'
```

## Api

### withFallback(fetcher, fallback)

Arguments:
 - `fetcher: () => Promise<ValueType>` - an async / sync function that returns a value of type \<ValueType>.
 - `fallback: ValueType` - a fallback value of type \<ValueType> that will be returned in case `fetcher` fails (throws)

Return Value: `Promise<ValueType>`