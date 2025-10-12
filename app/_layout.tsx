// app/_layout.tsx
import colors from "@/constants/Colors";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "../components/SplashScreen";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { useColorScheme } from "../hooks/useColorScheme";
import { PushNotificationProvider } from "../hooks/usePushNotifications";
import { ToastProvider } from "../hooks/useToast";
import { RootStackParamList } from "./_route.types";

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

// --- Transitions ---
const slideFromRight = {
  /* your slideFromRight code */
};
const slideFromBottom = {
  /* your slideFromBottom code */
};
const fadeTransition = {
  /* your fadeTransition code */
};

// Auth-aware Navigator Component
function AuthAwareNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();

  console.log(
    "🔐 Auth State - isLoading:",
    isLoading,
    "isAuthenticated:",
    isAuthenticated
  );

  // Show splash screen while checking authentication
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "light" ? DefaultTheme : DarkTheme}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack
          // Set initial route based on auth state - NO navigation needed!
          // initialRouteName={''}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors["bg-light"] },
            ...slideFromRight,
          }}
        >
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen
              name="(tabs)"
              options={{
                ...fadeTransition,
                gestureEnabled: false,
              }}
            />
          </Stack.Protected>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen
              name="onboarding"
              options={{
                ...fadeTransition,
                gestureEnabled: false,
              }}
            />
          </Stack.Protected>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen
              name="login"
              options={{
                ...fadeTransition,
                gestureEnabled: false,
              }}
            />
          </Stack.Protected>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen
              name="register"
              options={{
                ...fadeTransition,
                gestureEnabled: false,
              }}
            />
          </Stack.Protected>
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
          <AuthAwareNavigator />
        </PushNotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}