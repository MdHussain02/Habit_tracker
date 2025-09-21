// app/_layout.tsx
import colors from '@/constants/Colors';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../components/SplashScreen';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useColorScheme } from '../hooks/useColorScheme';
import { PushNotificationProvider } from '../hooks/usePushNotifications';
import { ToastProvider } from '../hooks/useToast';
import { RootStackParamList } from './_route.types';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// --- Notification handler ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// --- Transitions (unchanged) ---
const slideFromRight = { /* your slideFromRight code */ };
const slideFromBottom = { /* your slideFromBottom code */ };
const fadeTransition = { /* your fadeTransition code */ };

// --- Wrapper to decide initial screen based on auth ---
function AppNavigator() {
  const { user, isLoading,isAuthenticated } = useAuth(); // assuming your hook returns this
  const colorScheme = useColorScheme();

  if (isLoading) {
    // while checking auth, keep splash
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          initialRouteName={isAuthenticated ? '(tabs)' : 'onboarding'}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors["bg-light"] },
            ...slideFromRight, // default transition
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              ...fadeTransition,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="add-habit"
            options={{
              ...slideFromBottom,
              gestureEnabled: true,
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              ...fadeTransition,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="register"
            options={{
              ...fadeTransition,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              ...fadeTransition,
              gestureEnabled: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <PushNotificationProvider>
          <AppNavigator />
        </PushNotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
