import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { PookieColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import OnboardingScreen from '../screens/OnboardingScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    async function checkFirstLaunch() {
      const onboardingDone = await AsyncStorage.getItem('onboardingDone');
      const userRegistered = await AsyncStorage.getItem('userRegistered');
      if (!onboardingDone) {
        setShowOnboarding(true);
      } else if (!userRegistered) {
        setShowRegistration(true);
      }
      setIsLoading(false);
    }
    checkFirstLaunch();
  }, []);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('onboardingDone', 'true');
    setShowOnboarding(false);
    setShowRegistration(true);
  };

  const handleRegister = async (user: { name: string; email: string; password: string }) => {
    // Save user data as needed
    await AsyncStorage.setItem('userRegistered', 'true');
    setShowRegistration(false);
  };

  if (!loaded || isLoading) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showRegistration) {
    return <RegistrationScreen onRegister={handleRegister} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopColor: '#333',
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarActiveTintColor: PookieColors.hotPink,
          tabBarInactiveTintColor: '#666',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="coach"
          options={{
            title: 'Coach',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bulb" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
