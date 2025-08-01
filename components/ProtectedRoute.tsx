import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/onboarding' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but isn't
        router.replace(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but shouldn't be on this page (e.g., login/register when already logged in)
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7066F6" />
      </View>
    );
  }

  // Show children if authentication requirements are met
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
  },
}); 