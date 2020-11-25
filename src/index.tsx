import { NativeModules } from 'react-native';

type PlayInstallReferrerType = {
  multiply(a: number, b: number): Promise<number>;
};

const { PlayInstallReferrer } = NativeModules;

export default PlayInstallReferrer as PlayInstallReferrerType;
