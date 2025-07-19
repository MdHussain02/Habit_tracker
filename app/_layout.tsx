// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import OnboardingScreen from '../screens/OnboardingScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import { getUserData, setUserRegistered } from '../utils/storage';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await getUserData();
      if (!user) {
        setShowOnboarding(true);
      }
      setLoading(false);
    })();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowRegistration(true);
  };

  const handleRegister = async (user: any) => {
    // You can save user info here if needed
    await setUserRegistered();
    setShowRegistration(false);
  };

  if (loading) return null;
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }
  if (showRegistration) {
    return <RegistrationScreen onRegister={handleRegister} />;
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeProvider>
  );
}