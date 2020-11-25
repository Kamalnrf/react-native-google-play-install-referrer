import { useEffect, useReducer } from 'react';
import { NativeModules, Platform } from 'react-native';

export type ReferrerDetails = {
  url: string;
  clickTime: string;
  appInstallTime: string;
  instantExperienceLaunched: boolean;
};

export type ReferrerError =
  | 'RUNTIME_EXCEPTION'
  | 'FEATURE_NOT_SUPPORTED'
  | 'SERVICE_UNAVAILABLE'
  | 'DEVELOPER_ERROR';

type State = {
  status: 'idle' | 'pending' | 'resolved' | 'rejected';
  data: undefined | ReferrerDetails;
  error: undefined | ReferrerError;
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

  const setData = (details: ReferrerDetails) =>
    setState({ data: details, status: 'resolved' });
  const setError = (errorMessage: ReferrerError) =>
    setState({ error: errorMessage, status: 'rejected' });

  useEffect(() => {
    if (Platform.OS === 'android')
      NativeModules.PlayInstallReferrerModule.getReferrer()
        .then(setData)
        .catch((err: { message: ReferrerError }) => {
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
