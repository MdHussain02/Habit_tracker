import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  'habits/[id]': { id: string };
  // Add other routes as needed
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
