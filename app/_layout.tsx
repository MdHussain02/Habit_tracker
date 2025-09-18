// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../components/SplashScreen'; // Adjust path as needed
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

// Custom transition animations
const slideFromRight = {
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }: { current: any; layouts: any }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

const slideFromBottom = {
  gestureDirection: 'vertical' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 350,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 350,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }: { current: any; layouts: any }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

const fadeTransition = {
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    },
  },
  cardStyleInterpolator: ({ current }: { current: any }) => {
    return {
      cardStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    };
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
          <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
            <SafeAreaProvider style={{ flex: 1 }}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: '#ffffff' },
                ...slideFromRight, // Default transition
              }} 
            >
              {/* Custom transitions for specific screens */}
              <Stack.Screen 
                name="(tabs)" 
                options={{ 
                  ...fadeTransition,
                  gestureEnabled: false 
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
                  gestureEnabled: false 
                }} 
              />
              <Stack.Screen 
                name="register" 
                options={{ 
                  ...fadeTransition,
                  gestureEnabled: false 
                }} 
              />
              <Stack.Screen 
                name="onboarding" 
                options={{ 
                  ...fadeTransition,
                  gestureEnabled: false 
                }} 
              />
            </Stack>
            </SafeAreaProvider>
          </ThemeProvider>
        </PushNotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}