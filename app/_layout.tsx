// app/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import OnboardingScreen from '../screens/OnboardingScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import { Habit } from '../types/habit';
import { getUserData, setUserRegistered } from '../utils/storage';

TaskManager.defineTask('habit-notification-task', async () => {
  try {
    const habitsJson = await AsyncStorage.getItem('@habit_hero_habits');
    const habits: Habit[] = habitsJson ? JSON.parse(habitsJson) : [];
    const now = new Date();
    const NOTIFY_SECONDS_BEFORE = 10;
    const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (const habit of habits) {
      if (habit.reminder?.enabled && habit.reminder?.time) {
        const [hours, minutes] = habit.reminder.time.split(':').map(Number);
        const habitSeconds = hours * 3600 + minutes * 60;
        // If the habit time is within the next 10 seconds
        if (habitSeconds - nowSeconds > 0 && habitSeconds - nowSeconds <= NOTIFY_SECONDS_BEFORE) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Upcoming Habit: ${habit.name}`,
              body: `Your habit is coming up at ${habit.reminder.time}!`,
              data: { habitId: habit.id },
            },
            trigger: null, // Send immediately
          });
        }
      }
    }
    return true;
  } catch (error) {
    return false;
  }
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [hasReminders, setHasReminders] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUserData();
      if (!user) {
        setShowOnboarding(true);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await BackgroundTask.registerTaskAsync('habit-notification-task', {
          minimumInterval: 15, // minutes (minimum allowed on Android)
        });
      } catch (err) {
        console.log('[BackgroundTask] failed to register', err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Enable notifications to receive habit reminders!');
      }
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
  if (hasReminders === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
        <RegistrationScreen onRegister={handleRegister} />
        <Stack screenOptions={{ headerShown: false }} />
        <Button
          title="Test Background Task Now"
          onPress={async () => {
            try {
              await BackgroundTask.triggerTaskWorkerForTestingAsync();
              alert('Background task triggered!');
            } catch (e) {
              alert('Failed to trigger background task.');
            }
          }}
        />
        <Button
          title="Push Notification Now"
          onPress={async () => {
            try {
              const now = new Date();
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Manual Notification Test',
                  body: `Current time: ${now.toLocaleTimeString()}`,
                  data: { test: true },
                },
                trigger: null,
              });
              alert('Notification pushed!');
            } catch (e) {
              alert('Failed to push notification.');
            }
          }}
        />
        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center' }}>
          <View style={{ padding: 24, backgroundColor: '#222', borderRadius: 16 }}>
            <OnboardingScreen onComplete={handleOnboardingComplete} />
            <RegistrationScreen onRegister={handleRegister} />
            <Stack screenOptions={{ headerShown: false }} />
            <View style={{ alignItems: 'center' }}>
              <View style={{ marginBottom: 12 }}>
                <OnboardingScreen onComplete={handleOnboardingComplete} />
              </View>
              <View>
                <RegistrationScreen onRegister={handleRegister} />
              </View>
              <View style={{ marginTop: 12 }}>
                <Stack screenOptions={{ headerShown: false }} />
              </View>
              <View style={{ marginTop: 24 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ marginBottom: 8 }}>
                    <OnboardingScreen onComplete={handleOnboardingComplete} />
                  </View>
                  <View>
                    <RegistrationScreen onRegister={handleRegister} />
                  </View>
                  <View style={{ marginTop: 8 }}>
                    <Stack screenOptions={{ headerShown: false }} />
                  </View>
                  <View style={{ marginTop: 16 }}>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: 4 }}>
                        <OnboardingScreen onComplete={handleOnboardingComplete} />
                      </View>
                      <View>
                        <RegistrationScreen onRegister={handleRegister} />
                      </View>
                      <View style={{ marginTop: 4 }}>
                        <Stack screenOptions={{ headerShown: false }} />
                      </View>
                      <View style={{ marginTop: 8 }}>
                        <View style={{ alignItems: 'center' }}>
                          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>No habit reminders scheduled</Text>
                          <Text style={{ color: '#aaa', fontSize: 14, marginTop: 8 }}>Add a habit with a reminder to get started!</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
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
        <Button
          title="Test Background Task Now"
          onPress={async () => {
            try {
              await BackgroundTask.triggerTaskWorkerForTestingAsync();
              alert('Background task triggered!');
            } catch (e) {
              alert('Failed to trigger background task.');
            }
          }}
        />
        <Button
          title="Push Notification Now"
          onPress={async () => {
            try {
              const now = new Date();
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Manual Notification Test',
                  body: `Current time: ${now.toLocaleTimeString()}`,
                  data: { test: true },
                },
                trigger: null,
              });
              alert('Notification pushed!');
            } catch (e) {
              alert('Failed to push notification.');
            }
          }}
        />
      </View>
    </ThemeProvider>
  );
}