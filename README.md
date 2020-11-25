# react-native-google-play-install-referrer

Retrieve referral details on app install from Google Play.

The type of referral information we can get from Google Play by using [Google Play Install Referrer](https://developer.android.com/google/play/installreferrer):

- The referrer URL of the installed package.
- The timestamp, in seconds, of when a referrer click happened (both client- and server-side).
- The timestamp, in seconds, of when an installation began (both client- and server-side).
- The app's version at the time when the app was first installed.
- Whether the user has interacted with your app's instant experience in the past 7 days.

## Installation

```sh
npm install react-native-google-play-install-referrer
```

## Usage

```js
import useInstallReferrer from 'react-native-google-play-install-referrer';

export default function App() {
  const { isSuccess, isError, data, error } = useInstallReferrer();

  React.useEffect(() => {
    if (isSuccess)
      Alert.alert('Install Referrer Success', JSON.stringify(data));
    else if (isError) Alert.alert('Install Referrer Error', error);
  }, [isSuccess, isError, data, error]);
  return <></>;
}
```

On Success the data will have these values:

| key                       | value type | description                                                                                         |
| ------------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| url                       | string     | The referrer URL of the installed package.                                                          |
| clickTime                 | string     | The timestamp in seconds when referrer click happens.                                               |
| appInstallTime            | string     | The timestamp in seconds when installation begins.                                                  |
| instantExperienceLaunched | boolean    | Boolean indicating if the user has interacted with the app's instant experience in the past 7 days. |

On Error it returns a Flag used by google play installer api in `error`:

| value               | description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| RUNTIME_EXCEPTION   | Error caused while constructing InstallReferrerClient               |
| DEVELOPER_ERROR     | Install Referrer API not supported by the installed Play Store app. |
| SERVICE_UNAVAILABLE | Could not initiate connection to the Install Referrer service.      |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
