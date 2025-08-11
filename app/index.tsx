import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is logged in, redirect to main app
        router.replace('/(tabs)');
      } else {
        // User is not logged in, redirect to onboarding
        router.replace('/onboarding');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#7066F6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
  },
}); 