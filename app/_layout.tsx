// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider } from '../hooks/useAuth';
import { useColorScheme } from '../hooks/useColorScheme';
import { ToastProvider } from '../hooks/useToast';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Enable notifications to receive habit reminders!');
      }
    })();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}