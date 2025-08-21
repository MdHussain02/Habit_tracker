// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../hooks/useAuth';
import { useColorScheme } from '../hooks/useColorScheme';
import { PushNotificationProvider } from '../hooks/usePushNotifications';
import { ToastProvider } from '../hooks/useToast';
import { RootStackParamList } from './_route.types';
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    
  } as Notifications.NotificationBehavior),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ToastProvider>
        <PushNotificationProvider>
          <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
            <SafeAreaProvider style={{ flex: 1 }}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: '#ffffff' } 
              }} 
            />
            </SafeAreaProvider>
          </ThemeProvider>
        </PushNotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}


