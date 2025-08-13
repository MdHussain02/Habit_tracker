import { PookieColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import { useToast } from "../../hooks/useToast";
import { useNotificationService } from "../../services/notificationService";

interface LocalPreferences {
  notifications: boolean;
  habitReminders: boolean;
  streakAlerts: boolean;
  reports: boolean;
  motivationalMessages: boolean;
  testNotifications: boolean;
}

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { preferences, isLoading, error, updatePreferences } = usePushNotifications();
  const { 
    sendTestNotification, 
    triggerTestNotifications, 
    startTestNotifications, 
    stopTestNotifications,
    getJobsStatus 
  } = useNotificationService();

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
      showToast(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newPreferences[key] ? 'enabled' : 'disabled'}`, 'success');
    } catch (err) {
      // Revert on error
      setLocalPreferences(prev => ({ ...prev, [key]: !newPreferences[key] }));
      showToast('Failed to update notification preferences', 'error');
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification('Test Notification', 'This is a test notification from Habit Hero!');
      showToast('Test notification sent!', 'success');
    } catch (err) {
      showToast('Failed to send test notification', 'error');
    }
  };

  const handleTriggerTestNotifications = async () => {
    try {
      await triggerTestNotifications();
      showToast('Test notifications triggered!', 'success');
    } catch (err) {
      showToast('Failed to trigger test notifications', 'error');
    }
  };

  const handleStartTestNotifications = async () => {
    try {
      await startTestNotifications();
      showToast('Test notifications started!', 'success');
    } catch (err) {
      showToast('Failed to start test notifications', 'error');
    }
  };

  const handleStopTestNotifications = async () => {
    try {
      await stopTestNotifications();
      showToast('Test notifications stopped!', 'success');
    } catch (err) {
      showToast('Failed to stop test notifications', 'error');
    }
  };

  const handleGetJobsStatus = async () => {
    try {
      const status = await getJobsStatus();
      showToast(`Jobs status: ${status.status}`, 'info');
    } catch (err) {
      showToast('Failed to get jobs status', 'error');
    }
  };

  const settingsSections = [
    {
      title: "General Preferences",
      description: "Customize your app experience",
      items: [
        {
          id: "theme",
          title: "App Theme",
          description:
            "Choose between a light or dark visual theme for the application.",
          type: "toggle",
          value: darkMode,
          onValueChange: setDarkMode,
          icon: "color-palette",
        },
      ],
    },
    {
      title: "Notification Settings",
      description: "Manage how Habit Hero keeps you informed and motivated",
      items: [
        {
          id: "notifications",
          title: "Notifications",
          description:
            "Enable or disable all notifications.",
          type: "toggle",
          value: localPreferences.notifications,
          onValueChange: () => handleToggle('notifications'),
          icon: "notifications",
        },
        {
          id: "habit-reminders",
          title: "Habit Reminders",
          description:
            "Receive reminders when it's time to complete your habits.",
          type: "toggle",
          value: localPreferences.habitReminders,
          onValueChange: () => handleToggle('habitReminders'),
          icon: "notifications",
        },
        {
          id: "streak-alerts",
          title: "Streak Alerts",
          description:
            "Celebrate your streaks and get motivated to keep going.",
          type: "toggle",
          value: localPreferences.streakAlerts,
          onValueChange: () => handleToggle('streakAlerts'),
          icon: "trophy",
        },
        {
          id: "reports",
          title: "Weekly Reports",
          description:
            "Receive weekly summaries of your habit progress.",
          type: "toggle",
          value: localPreferences.reports,
          onValueChange: () => handleToggle('reports'),
          icon: "bar-chart",
        },
        {
          id: "motivational-messages",
          title: "Motivational Messages",
          description:
            "Get inspiring messages to help you stay on track.",
          type: "toggle",
          value: localPreferences.motivationalMessages,
          onValueChange: () => handleToggle('motivationalMessages'),
          icon: "bulb",
        },
        {
          id: "test-notifications",
          title: "Test Notifications",
          description:
            "Allow test notifications for debugging purposes.",
          type: "toggle",
          value: localPreferences.testNotifications,
          onValueChange: () => handleToggle('testNotifications'),
          icon: "bug",
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    return (
      <View key={item.id} style={styles.settingCard}>
        <View style={styles.settingHeader}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingDescription}>{item.description}</Text>
          </View>
          <View style={styles.settingIcon}>
            <Ionicons name={item.icon} size={24} color={PookieColors.hotPink} />
          </View>
        </View>
        <View style={styles.settingControl}>
          <Text style={styles.statusText}>
            {item.type === "toggle"
              ? item.value
                ? "Enabled"
                : "Disabled"
              : item.value}
          </Text>
          {item.type === "toggle" && (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: "#e2e8f0", true: PookieColors.hotPink }}
              thumbColor="#fff"
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.content}>
          {settingsSections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionDescription}>{section.description}</Text>
              
              {section.items.map((item) => (
                <View key={item.id} style={styles.settingCard}>
                  <View style={styles.settingHeader}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.settingIcon}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={PookieColors.hotPink}
                      />
                    </View>
                  </View>
                  <View style={styles.settingControl}>
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#e2e8f0', true: PookieColors.hotPink }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              ))}
            </View>
          ))}

          {/* Test Notifications Section */}
          <View style={styles.testSection}>
            <Text style={styles.testSectionTitle}>Test Notifications</Text>
              <Button
            type="secondary"
              onPress={handleTestNotification}

            >
              Send Test Notification
            </Button>
            <Button
            type="secondary"
              onPress={handleTriggerTestNotifications}
            >
              Trigger Test Notifications
            </Button>
            <Button
            type="secondary"
              onPress={handleStartTestNotifications}
            >
              Start Test Notifications
            </Button>
            <Button
            type="secondary"
              onPress={handleStopTestNotifications}
            >
              Stop Test Notifications
            </Button>
            <Button
            type="secondary"
              onPress={handleGetJobsStatus}
            >
              Get Jobs Status
            </Button>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <Button
            type="primary"
              onPress={() => {
                Alert.alert(
                  "Logout",
                  "Are you sure you want to logout?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    { 
                      text: "Logout", 
                      onPress: () => {
                        logout();
                        router.replace('/login');
                      } 
                    }
                  ]
                );
              }}
            >
              Logout
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13.5,
    color: '#64748b',
    lineHeight: 20,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
  } as const,
  logoutButtonText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    lineHeight: 20,
  },
  testSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  testButton: {
    backgroundColor: PookieColors.hotPink,
    marginTop: 8,
  } as const,
  testSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  logoutSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
});
