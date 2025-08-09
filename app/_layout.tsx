// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { AuthProvider } from '../hooks/useAuth';
import { useColorScheme } from '../hooks/useColorScheme';
import { PushNotificationProvider } from '../hooks/usePushNotifications';
import { ToastProvider } from '../hooks/useToast';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ToastProvider>
        <PushNotificationProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </PushNotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}