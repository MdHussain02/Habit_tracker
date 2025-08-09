import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useNotificationService } from '../services/notificationService';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import Button from './ui/Button';

interface NotificationPreferencesProps {
  onClose?: () => void;
}

interface LocalPreferences {
  notifications: boolean;
  habitReminders: boolean;
  streakAlerts: boolean;
  reports: boolean;
  motivationalMessages: boolean;
  testNotifications: boolean;
}

export function NotificationPreferences({ onClose }: NotificationPreferencesProps) {
  const { preferences, isLoading, error, updatePreferences, token, isRegistered, permissions } = usePushNotifications();
  const { sendTestNotification } = useNotificationService();
  const [localPreferences, setLocalPreferences] = useState<LocalPreferences>({
    notifications: true,
    habitReminders: true,
    streakAlerts: true,
    reports: true,
    motivationalMessages: true,
    testNotifications: false,
  });

  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        notifications: preferences.notifications ?? true,
        habitReminders: preferences.habitReminders ?? true,
        streakAlerts: preferences.streakAlerts ?? true,
        reports: preferences.reports ?? true,
        motivationalMessages: preferences.motivationalMessages ?? true,
        testNotifications: preferences.testNotifications ?? false,
      });
    }
  }, [preferences]);

  const handleToggle = async (key: keyof LocalPreferences) => {
    const newPreferences = {
      ...localPreferences,
      [key]: !localPreferences[key],
    };
    
    setLocalPreferences(newPreferences);
    
    try {
      await updatePreferences({ [key]: newPreferences[key] });
    } catch (err) {
      // Revert on error
      setLocalPreferences(prev => ({ ...prev, [key]: !newPreferences[key] }));
      Alert.alert('Error', 'Failed to update notification preferences');
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification('Test Notification', 'This is a test notification from Habit Hero!');
      Alert.alert('Success', 'Test notification sent!');
    } catch (err) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading preferences...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Notification Preferences</ThemedText>
        
        {error && (
          <ThemedText style={styles.error}>{error}</ThemedText>
        )}

        {/* Debug Information */}
        <View style={styles.debugSection}>
          <ThemedText style={styles.debugTitle}>Debug Information</ThemedText>
          <ThemedText style={styles.debugText}>Token: {token ? '✅ Set' : '❌ Not set'}</ThemedText>
          <ThemedText style={styles.debugText}>Registered: {isRegistered ? '✅ Yes' : '❌ No'}</ThemedText>
          <ThemedText style={styles.debugText}>Permissions: {permissions ? '✅ Granted' : '❌ Not granted'}</ThemedText>
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <ThemedText style={styles.preferenceTitle}>Notifications</ThemedText>
            <ThemedText style={styles.preferenceDescription}>
              Enable or disable all notifications
            </ThemedText>
          </View>
          <Switch
            value={localPreferences.notifications}
            onValueChange={() => handleToggle('notifications')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={localPreferences.notifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <ThemedText style={styles.preferenceTitle}>Habit Reminders</ThemedText>
            <ThemedText style={styles.preferenceDescription}>
              Get reminded when it's time to complete your habits
            </ThemedText>
          </View>
          <Switch
            value={localPreferences.habitReminders}
            onValueChange={() => handleToggle('habitReminders')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={localPreferences.habitReminders ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <ThemedText style={styles.preferenceTitle}>Streak Alerts</ThemedText>
            <ThemedText style={styles.preferenceDescription}>
              Celebrate your streaks and get motivated to keep going
            </ThemedText>
          </View>
          <Switch
            value={localPreferences.streakAlerts}
            onValueChange={() => handleToggle('streakAlerts')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={localPreferences.streakAlerts ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <ThemedText style={styles.preferenceTitle}>Weekly Reports</ThemedText>
            <ThemedText style={styles.preferenceDescription}>
              Receive weekly summaries of your habit progress
            </ThemedText>
          </View>
          <Switch
            value={localPreferences.reports}
            onValueChange={() => handleToggle('reports')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={localPreferences.reports ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <ThemedText style={styles.preferenceTitle}>Motivational Messages</ThemedText>
            <ThemedText style={styles.preferenceDescription}>
              Get inspiring messages to help you stay on track
            </ThemedText>
          </View>
          <Switch
            value={localPreferences.motivationalMessages}
            onValueChange={() => handleToggle('motivationalMessages')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={localPreferences.motivationalMessages ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <ThemedText style={styles.preferenceTitle}>Test Notifications</ThemedText>
            <ThemedText style={styles.preferenceDescription}>
              Allow test notifications for debugging
            </ThemedText>
          </View>
          <Switch
            value={localPreferences.testNotifications}
            onValueChange={() => handleToggle('testNotifications')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={localPreferences.testNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.testSection}>
          <Button
            onPress={handleTestNotification}
            style={styles.testButton}
          >
            Send Test Notification
          </Button>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  debugSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 14,
    marginBottom: 5,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  preferenceContent: {
    flex: 1,
    marginRight: 15,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  testSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  testButton: {
    width: '100%',
    maxWidth: 300,
  },
});
