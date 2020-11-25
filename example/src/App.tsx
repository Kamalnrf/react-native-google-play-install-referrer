import * as React from 'react';
import { Alert } from 'react-native';
import useInstallReferrer from 'react-native-play-install-referrer';

export default function App() {
  const { isSuccess, isError, data, error } = useInstallReferrer();

  React.useEffect(() => {
    if (isSuccess) Alert.alert('Install Referer Success', `URL: ${data?.url}`);
    else if (isError) Alert.alert('Install Referrer Error', error);
  }, [isSuccess, isError, data?.url, error]);
  return <></>;
}
