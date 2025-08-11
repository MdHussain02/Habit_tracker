import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useApi } from './useApi';
import { useAuth } from './useAuth';

interface NotificationPreferences {
  notifications?: boolean;
  habitReminders?: boolean;
  streakAlerts?: boolean;
  reports?: boolean;
  motivationalMessages?: boolean;
  testNotifications?: boolean;
}

interface PushNotificationState {
  token: string | null;
  isRegistered: boolean;
  permissions: Notifications.PermissionStatus | null;
  preferences: NotificationPreferences | null;
}

interface PushNotificationContextType extends PushNotificationState {
  isLoading: boolean;
  error: string | null;
  registerForPushNotifications: () => Promise<boolean>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<NotificationPreferences | undefined>;
  fetchPreferences: () => Promise<void>;
}

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined);

export function PushNotificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PushNotificationState>({
    token: null,
    isRegistered: false,
    permissions: null,
    preferences: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchPost, fetchGet, fetchPut } = useApi();
  const { isAuthenticated } = useAuth();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || '';

  // Configure notification handler
  useEffect(() => {
    console.log('Configuring notification handler...');
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      console.log('🔔 Notification Received:', notification);
    });

    // Listen for notification responses (when user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      console.log('👆 Notification Clicked:', response);
      // Handle navigation or other actions based on notification data
      handleNotificationResponse(response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const handleNotificationResponse = useCallback((response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    // Handle different notification types
    if (data?.type === 'habit_reminder') {
      // Navigate to habit details or mark as completed
      console.log('Habit reminder clicked:', data.habitId);
    } else if (data?.type === 'streak_alert') {
      // Navigate to analytics or show streak celebration
      console.log('Streak alert clicked:', data.streak);
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    console.log('Requesting notification permissions...');
    
    if (!Device.isDevice) {
      const errorMsg = 'Push notifications require a physical device';
      console.log('❌', errorMsg);
      setError(errorMsg);
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('Current permission status:', existingStatus);
      
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        console.log('Requesting permission...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('Permission request result:', status);
      }

      if (finalStatus !== 'granted') {
        const errorMsg = 'Permission not granted for push notifications';
        console.log('❌', errorMsg);
        setError(errorMsg);
        return false;
      }

      console.log('✅ Permission granted');
      setState(prev => ({ ...prev, permissions: finalStatus }));
      return true;
    } catch (err) {
      const errorMsg = 'Failed to request notification permissions';
      console.log('❌', errorMsg, err);
      setError(errorMsg);
      return false;
    }
  }, []);

  const getDeviceToken = useCallback(async (): Promise<string | null> => {
    console.log('Getting device token...');
    
    try {
      if (!Device.isDevice) {
        const errorMsg = 'Push notifications require a physical device';
        console.log('❌', errorMsg);
        setError(errorMsg);
        return null;
      }

      console.log('Getting device push token...');
      
      // Check if we're in development or production
      const isDevelopment = __DEV__;
      console.log('Development mode:', isDevelopment);
      
      let token;
      if (isDevelopment) {
        // In development, try to get the token but handle Firebase errors gracefully
        try {
          const tokenData = await Notifications.getDevicePushTokenAsync();
          token = tokenData.data;
          console.log('✅ Device Push Token (dev):', token);
        } catch (firebaseError) {
          console.log('⚠️ Firebase not initialized in development, using Expo push token instead');
          console.log('Firebase error:', firebaseError);
          
          // Fallback to Expo push token for development
          try {
            const expoTokenData = await Notifications.getExpoPushTokenAsync({
              projectId: 'be86e26c-3853-4c6e-b129-ef96fede04e2', // Your EAS project ID
            });
            token = expoTokenData.data;
            console.log('✅ Expo Push Token (dev):', token);
          } catch (expoError) {
            console.log('❌ Failed to get Expo push token:', expoError);
            throw expoError;
          }
        }
      } else {
        // In production, use device push token
        const tokenData = await Notifications.getDevicePushTokenAsync();
        token = tokenData.data;
        console.log('✅ Device Push Token (prod):', token);
      }
      
      return token;
    } catch (err) {
      const errorMsg = 'Failed to get device push token';
      console.log('❌', errorMsg, err);
      setError(errorMsg);
      return null;
    }
  }, []);

  const updatePushToken = useCallback(async (token: string) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping token update');
      return;
    }

    try {
      console.log('Updating push token on backend:', token);
      // Use the correct API format from Postman collection
      await fetchPost(`${baseUrl}/notifications/token`, { fcmToken: token });
      setState(prev => ({ ...prev, token, isRegistered: true }));
      console.log('✅ Push token updated successfully');
    } catch (err) {
      const errorMsg = 'Failed to update push token on backend';
      console.log('❌', errorMsg, err);
      setError(errorMsg);
    }
  }, [fetchPost, isAuthenticated, baseUrl]);

  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      console.log('Fetching notification preferences...');
      const preferences = await fetchGet(`${baseUrl}/notifications/preferences`);
      setState(prev => ({ ...prev, preferences }));
      console.log('✅ Preferences fetched:', preferences);
    } catch (err) {
      console.error('Failed to fetch notification preferences:', err);
    }
  }, [fetchGet, isAuthenticated, baseUrl]);

  const updatePreferences = useCallback(async (preferences: Partial<NotificationPreferences>) => {
    if (!isAuthenticated) return;

    try {
      console.log('Updating preferences:', preferences);
      const updatedPreferences = await fetchPut(`${baseUrl}/notifications/preferences`, preferences);
      setState(prev => ({ ...prev, preferences: updatedPreferences }));
      console.log('✅ Preferences updated:', updatedPreferences);
      return updatedPreferences;
    } catch (err) {
      const errorMsg = 'Failed to update notification preferences';
      console.log('❌', errorMsg, err);
      setError(errorMsg);
      throw err;
    }
  }, [fetchPut, isAuthenticated, baseUrl]);

  const registerForPushNotifications = useCallback(async () => {
    console.log('🚀 Starting push notification registration...');
    setIsLoading(true);
    setError(null);

    try {
      // Request permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('❌ Permission not granted, stopping registration');
        setIsLoading(false);
        return false;
      }

      // Get device token
      const token = await getDeviceToken();
      if (!token) {
        console.log('❌ No device token, stopping registration');
        setIsLoading(false);
        return false;
      }

      // Update token on backend
      await updatePushToken(token);

      // Fetch preferences
      await fetchPreferences();

      console.log('✅ Push notification registration completed successfully');
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMsg = 'Failed to register for push notifications';
      console.log('❌', errorMsg, err);
      setError(errorMsg);
      setIsLoading(false);
      return false;
    }
  }, [requestPermissions, getDeviceToken, updatePushToken, fetchPreferences]);

  // Auto-register when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !state.isRegistered) {
      console.log('🔄 User authenticated, auto-registering for push notifications...');
      registerForPushNotifications();
    }
  }, [isAuthenticated, state.isRegistered, registerForPushNotifications]);

  const value: PushNotificationContextType = {
    ...state,
    isLoading,
    error,
    registerForPushNotifications,
    updatePreferences,
    fetchPreferences,
  };

  return React.createElement(PushNotificationContext.Provider, { value }, children);
}

export function usePushNotifications() {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotifications must be used within a PushNotificationProvider');
  }
  return context;
}
