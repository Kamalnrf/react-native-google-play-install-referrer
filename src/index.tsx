import { useEffect, useReducer } from 'react';
import { NativeModules, Platform } from 'react-native';

type ReferrerDetails = {
  url: string;
  clickTime: string;
  appInstallTime: string;
  instantExperienceLaunched: boolean;
};

type State = {
  status: 'idle' | 'pending' | 'resolved' | 'rejected';
  data: undefined | ReferrerDetails;
  error: undefined | string;
};

const initialState: State = {
  status: 'idle',
  data: undefined,
  error: undefined,
};

export default function useInstallReferrer() {
  const [{ status, data, error }, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    initialState
  );

  const setData = (data: ReferrerDetails) =>
    setState({ data, status: 'resolved' });
  const setError = (error: string) => setState({ error, status: 'rejected' });

  useEffect(() => {
    if (Platform.OS === 'android')
      NativeModules.PlayInstallReferrerModule.getReferrer()
        .then(setData)
        .catch((err: Error) => {
          setError(err.message);
        });
  }, []);

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',
    data,
    error,
  };
}
