import * as React from 'react';
import { Alert } from 'react-native';
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
