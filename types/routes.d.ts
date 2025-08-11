import { type RouteProp as NTRouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  'habits/[id]': { id: string };
  // Add other routes here as needed
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RouteProp<T extends keyof RootStackParamList> = NTRouteProp<RootStackParamList, T>;
