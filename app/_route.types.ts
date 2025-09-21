
export type RootStackParamList = {
  'habits/[id]': { id: string };
  onboarding: undefined;
  'profile/settings': undefined;
  'profile/edit': undefined;
  // Add other routes as needed
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
